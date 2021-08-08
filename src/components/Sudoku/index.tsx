import React, { useEffect } from 'react';
import { Dimensions, View } from 'react-native';
import { connect, ConnectedProps } from 'react-redux';
import Consants from 'expo-constants';
import { debounce } from 'lodash';

import { AppDispatch, RootState } from '../../storage/store';
import {
  GAP_BETWEEN_COMPONENTS,
  NAVIGATION_HEADER_HEIGHT,
  SUDOKU_CELL_NORMAL_MARGIN,
} from '../../styles';
import { DEBOUNCE_WAIT, getCellSize } from '../../sudoku';

import Board from './Board';
import Controller from './Controller';
import Info, { INFO_FONT_SIZE } from './Info';

const Sudoku: React.FC<Props> = ({
  id,
  userId,
  hasSudokuGameForUser,
  boardSize,
  theme,
}) => {
  if (hasSudokuGameForUser && userId) {
    const [dimensions, setDimensions] = React.useState({
      height: Dimensions.get('window').height,
      width: Dimensions.get('window').width,
    });

    // Listens for window size changes
    useEffect(() => {
      const debouncedHandleResize = debounce(function handleResize() {
        const { height, width } = Dimensions.get('window');
        setDimensions({
          height: height,
          width: width,
        });
      }, DEBOUNCE_WAIT);
      Dimensions.addEventListener('change', debouncedHandleResize);

      return () => {
        debouncedHandleResize.cancel();
        Dimensions.removeEventListener('change', debouncedHandleResize);
      };
    }, []);

    // Get screen orientation
    const screen = Dimensions.get('window');
    const isPortrait = screen.width <= screen.height;

    // Set screenStyles theme based on screen type
    const screenStyles = isPortrait ? theme.portrait : theme.landscape;

    // Get initial cell dimensions based on height
    let dimension =
      dimensions.height - Consants.statusBarHeight - NAVIGATION_HEADER_HEIGHT;
    let cellSize = getCellSize(dimension, boardSize);

    // Resize again to account for Info & Controller component extra space
    const extraSpace =
      cellSize * 3 +
      SUDOKU_CELL_NORMAL_MARGIN * 2 +
      GAP_BETWEEN_COMPONENTS * 4 +
      INFO_FONT_SIZE;
    if (isPortrait) {
      // Effective dimension is based on height for portrait
      let effectiveDimension = dimensions.height - extraSpace;

      // If effectiveDimension is larger than width, readjust
      effectiveDimension = Math.min(effectiveDimension, dimensions.width);

      cellSize = getCellSize(effectiveDimension, boardSize);
    } else {
      // Effective dimension is based on width for landscape
      let effectiveDimension = dimensions.width - extraSpace;

      // If effectiveDimension is larger than height, readjust
      effectiveDimension = Math.min(effectiveDimension, dimensions.height);

      cellSize = getCellSize(effectiveDimension, boardSize);
    }
    cellSize = Math.floor(cellSize);

    return (
      <View style={screenStyles.sudokuContainer}>
        <View style={screenStyles.sudokuContainerForInfo}>
          <Info id={id} userId={userId} isPortrait={isPortrait} />
        </View>
        <View style={screenStyles.sudokuContainerForBoard}>
          <Board
            id={id}
            userId={userId}
            cellSize={cellSize}
            isPressable={true}
            isPortrait={isPortrait}
            hideSelectedColor={false}
          />
        </View>
        <View style={screenStyles.sudokuContainerForController}>
          <Controller
            id={id}
            userId={userId}
            cellSize={cellSize}
            isPortrait={isPortrait}
          />
        </View>
      </View>
    );
  } else {
    return <></>;
  }
};

interface OwnProps {
  id: string;
  boardSize: number;
  isPortrait: boolean;
  route: any; // TODO fix this type
}

const mapState = ({ status, theme, users }: RootState, { route }: OwnProps) => {
  let hasSudokuGameForUser = false;
  let boardSize = 0;

  const id = route.params.id;
  const { userId } = status;
  if (userId && userId in users) {
    const { sudokus } = users[userId];

    if (id in sudokus) {
      hasSudokuGameForUser = true;
      boardSize = sudokus[id].board.length;
    }
  }

  return {
    id,
    userId,
    boardSize,
    hasSudokuGameForUser,
    theme,
  };
};

const mapDispatch = (dispatch: AppDispatch) => ({
  dispatch,
});

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = OwnProps & PropsFromRedux;

export default connect(mapState)(Sudoku);

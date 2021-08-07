import React, { useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Dimensions, View } from 'react-native';
import Consants from 'expo-constants';
import { debounce } from 'lodash';
import { AppDispatch, RootState } from '../../storage/store';
import Board from './Board';
import Controller from './Controller';
import Info, { INFO_FONT_SIZE } from './Info';
import { DEBOUNCE_WAIT, getCellSize } from '../../sudoku';
import {
  GAP_BETWEEN_COMPONENTS,
  NAVIGATION_HEADER_HEIGHT,
  SUDOKU_CELL_NORMAL_MARGIN,
} from '../../styles';

function Sudoku({ id, userId, hasSudokuGameForUser, boardSize, theme }: Props) {
  if (hasSudokuGameForUser && userId) {
    // Get screen orientation
    const screen = Dimensions.get('window');
    const isPortrait = screen.width <= screen.height;

    // Set screenStyles theme based on screen type
    const screenStyles = isPortrait ? theme.portrait : theme.landscape;

    const [dimensions, setDimensions] = React.useState({
      height: Dimensions.get('window').height,
      width: Dimensions.get('window').width,
    });

    // Get initial cell dimensions based on height
    const rootSize = Math.sqrt(boardSize);
    let dimension =
      dimensions.height - Consants.statusBarHeight - NAVIGATION_HEADER_HEIGHT;
    let cellSize = getCellSize(dimension, boardSize, SUDOKU_CELL_NORMAL_MARGIN);

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

      cellSize = getCellSize(
        effectiveDimension,
        boardSize,
        SUDOKU_CELL_NORMAL_MARGIN
      );
    } else {
      // Effective dimension is based on width for landscape
      let effectiveDimension = dimensions.width - extraSpace;

      // If effectiveDimension is larger than height, readjust
      effectiveDimension = Math.min(effectiveDimension, dimensions.height);

      cellSize = getCellSize(
        effectiveDimension,
        boardSize,
        SUDOKU_CELL_NORMAL_MARGIN
      );
    }
    cellSize = Math.floor(cellSize);

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

    return (
      <View style={screenStyles.sudokuContainer}>
        <View style={screenStyles.sudokuContainerForInfo}>
          <Info id={id} userId={userId} />
        </View>
        <View style={screenStyles.sudokuContainerForBoard}>
          <Board
            id={id}
            userId={userId}
            isPressable={true}
            hideSelectedColor={false}
            cellSize={cellSize}
          />
        </View>
        <View style={screenStyles.sudokuContainerForController}>
          <Controller id={id} userId={userId} cellSize={cellSize} />
        </View>
      </View>
    );
  } else {
    return <View></View>;
  }
}

interface OwnProps {
  id: string;
  boardSize: number;
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

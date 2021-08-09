import React from 'react';
import { View } from 'react-native';
import { connect, ConnectedProps } from 'react-redux';

import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamsList } from '../Navigators/RootStack';

import { AppDispatch, RootState } from '../../storage/store';
import {
  GAP_BETWEEN_COMPONENTS,
  NAVIGATION_HEADER_HEIGHT,
  SUDOKU_CELL_NORMAL_MARGIN,
} from '../../styles';
import { DEBOUNCE_WAIT, getCellSize } from '../../sudoku';

import useDebounceDimensions from '../../hooks/useDebounceDimensions';
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
    const { dimensions, isPortrait } = useDebounceDimensions(DEBOUNCE_WAIT);

    // Set screenStyles theme based on screen type
    const screenStyles = isPortrait ? theme.portrait : theme.landscape;

    // Get initial cell dimensions based on height
    const headerHeight = NAVIGATION_HEADER_HEIGHT;
    let boardDimension = dimensions.height - headerHeight;
    let cellSize = getCellSize(boardDimension, boardSize);

    // Resize again to account for Info & Controller component extra space
    const extraSpace =
      cellSize * 3 +
      SUDOKU_CELL_NORMAL_MARGIN * 2 +
      GAP_BETWEEN_COMPONENTS * 4 +
      INFO_FONT_SIZE;
    let effectiveHeight;
    let effectiveWidth;
    if (isPortrait) {
      // Effective dimension is based on height for portrait
      effectiveHeight = dimensions.height - headerHeight - extraSpace;
      effectiveWidth = dimensions.width;
    } else {
      // Effective dimension is based on width for landscape
      effectiveWidth = dimensions.width - extraSpace;
      effectiveHeight = dimensions.height - headerHeight;
    }
    boardDimension = Math.min(effectiveWidth, effectiveHeight);
    cellSize = Math.floor(getCellSize(boardDimension, boardSize));

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
type HomeScreenNavigationProp = StackNavigationProp<
  RootStackParamsList,
  'Sudoku'
>;
type HomeScreenRouteProp = RouteProp<RootStackParamsList, 'Sudoku'>;

interface OwnProps {
  id: string;
  boardSize: number;
  isPortrait: boolean;
  navigation: HomeScreenNavigationProp;
  route: HomeScreenRouteProp;
}

const mapState = ({ status, theme, users }: RootState, { route }: OwnProps) => {
  const id = route.params.id;
  const { userId } = status;

  const hasSudokuGameForUser =
    userId && users[userId]?.sudokus[id] ? true : false;
  const boardSize = (userId && users[userId]?.sudokus[id]?.board?.length) || 9;

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

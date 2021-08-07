import React, { useEffect } from 'react';
import { Dimensions, View } from 'react-native';
import { connect, ConnectedProps } from 'react-redux';
import Consants from 'expo-constants';
import { debounce } from 'lodash';

import { AppDispatch, RootState } from '../../storage/store';
import {
  NAVIGATION_HEADER_HEIGHT,
  SUDOKU_CELL_NORMAL_MARGIN,
} from '../../styles';
import { getCellSize, EMPTY_BOARDS, DEBOUNCE_WAIT } from '../../sudoku';

import SudokuCell from './SudokuCell';

function Board({
  id,
  boardSize,
  boardDimension,
  cellSize,
  isPressable,
  userId,
  hasUserBoard,
  hideSelectedColor = false,
  theme,
}: Props) {
  // Get screen orientation
  const screen = Dimensions.get('window');
  const isPortrait = screen.width <= screen.height;

  // Set screenStyles theme based on screen type
  const screenStyles = isPortrait ? theme.portrait : theme.landscape;

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

  // Board is presentational. It should be as stateless as possible to avoid
  // rerenders. Only the states in Cells should know if it needs to rerender
  const emptyBoard = EMPTY_BOARDS[boardSize];

  // Get cell dimensions if not provided
  const rootSize = Math.sqrt(boardSize);
  if (!cellSize) {
    let effectiveHeight =
      dimensions.height - Consants.statusBarHeight - NAVIGATION_HEADER_HEIGHT;
    let effectiveWidth = dimensions.width;
    let dimension = Math.min(effectiveHeight, effectiveWidth);
    if (boardDimension) dimension = boardDimension;

    cellSize = Math.floor(
      getCellSize(dimension, boardSize, SUDOKU_CELL_NORMAL_MARGIN)
    );
  }

  return (
    <View
      // NOTE: Board top and left margin is controlled by outer container
      // using padding to simplify individual cell styles
      style={screenStyles.board}
    >
      {emptyBoard.map((rows, row) => (
        <View key={row} style={screenStyles.cellRows}>
          {rows.map((_, col) => {
            // Calculate subgrid seperation magins
            const isSepRight = col !== boardSize - 1 && col % rootSize == 2;
            const isSepBottom = row !== boardSize - 1 && row % rootSize == 2;

            let cstyle = screenStyles.cellNormBottomRight;
            if (isSepBottom && isSepRight)
              cstyle = screenStyles.cellSepBottomRight;
            else if (isSepBottom) cstyle = screenStyles.cellSepBottomNormRight;
            else if (isSepRight) cstyle = screenStyles.cellSepRightNormBottom;

            return (
              <SudokuCell
                key={col}
                id={id}
                userId={hasUserBoard ? userId : null}
                col={col}
                row={row}
                cellSize={cellSize ? cellSize : 30}
                isPressable={isPressable}
                style={cstyle}
                hideSelectedColor={hideSelectedColor}
              />
            );
          })}
        </View>
      ))}
    </View>
  );
}

interface OwnProps {
  id: string;
  userId?: string | null;
  boardDimension?: number;
  cellSize?: number;
  isPressable: boolean;
  hideSelectedColor?: boolean;
}

const mapState = (
  { theme, sudokus, users }: RootState,
  { id, userId }: OwnProps
) => {
  return {
    boardSize: sudokus[id].board.length,
    hasUserBoard:
      userId && userId in users && id in users[userId].sudokus ? true : false,
    theme,
  };
};

const mapDispatch = (dispatch: AppDispatch) => ({
  dispatch,
});

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = OwnProps & PropsFromRedux;

export default connect(mapState)(Board);

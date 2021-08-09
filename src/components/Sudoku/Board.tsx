import React from 'react';
import { View } from 'react-native';
import { connect, ConnectedProps } from 'react-redux';

import { AppDispatch, RootState } from '../../storage/store';
import { NAVIGATION_HEADER_HEIGHT, NAVIGATION_TAB_HEIGHT } from '../../styles';
import { getCellSize, EMPTY_BOARDS, DEBOUNCE_WAIT } from '../../sudoku';

import useDebounceDimensions from '../../hooks/useDebounceDimensions';
import SudokuCell from './SudokuCell';

const Board: React.FC<Props> = ({
  id,
  userId,
  boardSize,
  boardDimension,
  cellSize,
  hideSelectedColor = false,
  isPressable,
  isPortrait,
  theme,
}) => {
  // Board is presentational. It should be as stateless as possible to avoid
  // rerenders. Only the states in Cells should know if it needs to rerender
  const emptyBoard = EMPTY_BOARDS[boardSize];
  const rootSize = Math.sqrt(boardSize);

  // Get cell dimensions if not provided
  if (!cellSize || isPortrait === undefined) {
    if (!boardDimension) {
      const headerHeight = NAVIGATION_HEADER_HEIGHT;
      const tabBarHeight = NAVIGATION_TAB_HEIGHT;

      const { dimensions, isPortrait: dIsPortrait } =
        useDebounceDimensions(DEBOUNCE_WAIT);
      isPortrait = dIsPortrait;

      let effectiveHeight = dimensions.height - tabBarHeight - headerHeight;
      let effectiveWidth = dimensions.width;
      boardDimension = Math.min(effectiveHeight, effectiveWidth);
    }

    cellSize = Math.floor(getCellSize(boardDimension, boardSize));
  }

  // Set screenStyles theme based on screen type
  const screenStyles = isPortrait ? theme.portrait : theme.landscape;

  return (
    <View
      // NOTE: Board top and left margin is controlled by outer container
      // using padding to simplify individual cell styles
      style={screenStyles.board}
    >
      {emptyBoard.map((rows, row) => (
        <View key={row} style={screenStyles.cellRows}>
          {rows.map((_, col) => {
            // Calculate subgrid margins
            const isSubRight = col !== boardSize - 1 && col % rootSize == 2;
            const isSubBottom = row !== boardSize - 1 && row % rootSize == 2;

            let cstyle = screenStyles.cellNormBottomRight;
            if (isSubBottom && isSubRight)
              cstyle = screenStyles.cellSubBottomRight;
            else if (isSubBottom) cstyle = screenStyles.cellSubBottomNormRight;
            else if (isSubRight) cstyle = screenStyles.cellSubRightNormBottom;

            return (
              <SudokuCell
                key={col}
                id={id}
                userId={userId}
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
};

interface OwnProps {
  id: string;
  userId?: string;
  boardDimension?: number;
  cellSize?: number;
  hideSelectedColor?: boolean;
  isPressable: boolean;
  isPortrait?: boolean;
}

const mapState = (
  { theme, sudokus, users }: RootState,
  { id, userId }: OwnProps
) => {
  return {
    boardSize: sudokus[id].board.length,
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

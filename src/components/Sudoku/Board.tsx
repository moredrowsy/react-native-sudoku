import React from 'react';
import { Platform, View } from 'react-native';
import { connect, ConnectedProps } from 'react-redux';

import { AppDispatch, RootState } from '../../storage/store';
import {
  BOARD_PADDING,
  NAVIGATION_HEADER_HEIGHT,
  NAVIGATION_TAB_HEIGHT,
} from '../../styles';
import { EMPTY_BOARDS, DEBOUNCE_WAIT } from '../../sudoku';

import useDebounceDimensions from '../../hooks/useDebounceDimensions';
import SudokuCell from './SudokuCell';

const Board: React.FC<Props> = ({
  id,
  userId,
  boardSize,
  boardDimension,
  hideSelectedColor = false,
  isPressable,
  isPortrait,
  theme,
}) => {
  // Board is presentational. It should be as stateless as possible to avoid
  // rerenders. Only the states in Cells should know if it needs to rerender
  const emptyBoard = EMPTY_BOARDS[boardSize];
  const rootSize = Math.sqrt(boardSize);

  // Get board dimension if not provided
  if (!boardDimension) {
    const headerHeight = NAVIGATION_HEADER_HEIGHT;
    const tabBarHeight = NAVIGATION_TAB_HEIGHT;

    const dimensions = useDebounceDimensions(
      Platform.OS === 'ios' || Platform.OS === 'android' ? 0 : DEBOUNCE_WAIT
    );
    isPortrait = dimensions.isPortrait;

    let effectiveHeight = dimensions.height - tabBarHeight - headerHeight;
    let effectiveWidth = dimensions.width;
    boardDimension = Math.min(effectiveHeight, effectiveWidth);

    // Apply some padding
    if (isPortrait) boardDimension -= BOARD_PADDING * 2;
  }

  // Set styles theme based on screen type
  const styles = isPortrait ? theme.portrait : theme.landscape;

  return (
    <View
      style={{
        width: boardDimension,
        height: boardDimension,
      }}
    >
      <View style={styles.gridContainer}>
        {emptyBoard.map((rows, row) => {
          return (
            <View key={row} style={styles.gridRowContainer}>
              {rows.map((_, col) => {
                const isSubRight = col !== boardSize - 1 && col % rootSize == 2;
                const isSubBottom =
                  row !== boardSize - 1 && row % rootSize == 2;
                let cStyle = styles.gridColContainer;

                // Normal cell
                if (col !== 0 && row !== 0) {
                  if (isSubBottom && isSubRight) {
                    cStyle = styles.gridColCornerSubRightBottom;
                  } else if (isSubBottom) {
                    cStyle = styles.gridColContainerSubBottom;
                  } else if (isSubRight) {
                    cStyle = styles.gridColContainerSubRight;
                  } else {
                    cStyle = styles.gridColContainer;
                  }
                }
                // Top left
                else if (col === 0 && row === 0) {
                  cStyle = styles.gridColTopLeft;
                }
                // First col
                else if (col === 0) {
                  if (!isSubBottom) cStyle = styles.gridColFirstCol;
                  else cStyle = styles.gridColFirstColSubBottom;
                }
                // First row
                else if (row === 0) {
                  if (!isSubRight) cStyle = styles.gridColFirstRow;
                  else cStyle = styles.gridColFirstRowSubRight;
                } else {
                  cStyle = styles.gridColContainer;
                }

                return (
                  <View key={col} style={cStyle}>
                    <SudokuCell
                      key={col}
                      id={id}
                      userId={userId}
                      col={col}
                      row={row}
                      boardDimension={boardDimension as number}
                      hideSelectedColor={hideSelectedColor}
                      isPressable={isPressable}
                    />
                  </View>
                );
              })}
            </View>
          );
        })}
      </View>
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

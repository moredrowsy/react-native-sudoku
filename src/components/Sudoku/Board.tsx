import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';

// Redux
import { connect, ConnectedProps } from 'react-redux';
import { AppDispatch, RootState } from '../../storage/store';
import {
  cellColorThemes,
  cellStyles,
  SUDOKU_CELL_NORMAL_MARGIN,
} from '../../styles';
import { getCellSize, EMPTY_BOARDS } from '../../sudoku';
import SudokuCell from './SudokuCell';

function Board({
  id,
  boardSize,
  boardDimension,
  isPressable,
  userId,
  hasUserBoard,
  hideSelectedColor = false,
}: Props) {
  const cellColors = cellColorThemes.default;
  const cellMarginStyle = {
    backgroundColor: cellColors.margin,
  };

  const rootSize = Math.sqrt(boardSize);
  const emptyBoard = EMPTY_BOARDS[boardSize];
  const { width, height } = Dimensions.get('window');
  const dimension = boardDimension ? boardDimension : Math.min(width, height);
  const cellSize = getCellSize(dimension, boardSize, SUDOKU_CELL_NORMAL_MARGIN);

  return (
    <View
      // NOTE: Board top and left margin is controlled by outer container
      // using padding to simply cell styles
      style={{
        paddingTop: SUDOKU_CELL_NORMAL_MARGIN,
        paddingLeft: 1,
        backgroundColor: cellColors.margin,
      }}
    >
      {emptyBoard.map((rows, row) => (
        <View key={row} style={[styles.cellRow, cellMarginStyle]}>
          {rows.map((_, col) => {
            // Calculate subgrid seperation magins
            const isSepRight = col !== boardSize - 1 && col % rootSize == 2;
            const isSepBottom = row !== boardSize - 1 && row % rootSize == 2;

            let cstyle = cellStyles.cellNormBottomRight;
            if (isSepBottom && isSepRight)
              cstyle = cellStyles.cellSepBottomRight;
            else if (isSepBottom) cstyle = cellStyles.cellSepBottomNormRight;
            else if (isSepRight) cstyle = cellStyles.cellSepRightNormBottom;

            return (
              <SudokuCell
                key={col}
                id={id}
                userId={hasUserBoard ? userId : null}
                col={col}
                row={row}
                cellSize={cellSize}
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
  isPressable: boolean;
  hideSelectedColor?: boolean;
}

const mapState = ({ sudokus, users }: RootState, { id, userId }: OwnProps) => {
  return {
    boardSize: sudokus[id].board.length,
    hasUserBoard:
      userId && userId in users && id in users[userId].sudokus ? true : false,
  };
};

const mapDispatch = (dispatch: AppDispatch) => ({
  dispatch,
});

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = OwnProps & PropsFromRedux;

export default connect(mapState)(Board);

const styles = StyleSheet.create({
  cellRow: {
    flexDirection: 'row',
  },
});

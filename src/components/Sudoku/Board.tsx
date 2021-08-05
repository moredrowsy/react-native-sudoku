import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';

// Redux
import { connect, ConnectedProps } from 'react-redux';
import { AppDispatch, RootState } from '../../storage/store';
import { black, blue, white } from '../../styles';
import { cellStyles, SUDOKU_CELL_NORMAL_MARGIN } from '../../styles/sudoku';
import { getCellSize, makeEmptyEmptyBoard } from '../../sudoku';
import SudokuCell from './SudokuCell';

function Board({
  id,
  boardSize,
  boardDimension,
  isPressable,
  userId,
  hasUserBoard,
  noSelectedColor = false,
}: Props) {
  const rootSize = Math.sqrt(boardSize);
  const emptyBoard = makeEmptyEmptyBoard(boardSize);
  const { width, height } = Dimensions.get('window');
  const dimension = boardDimension ? boardDimension : Math.min(width, height);
  const cellSize = getCellSize(dimension, boardSize, SUDOKU_CELL_NORMAL_MARGIN);

  return (
    <View>
      {emptyBoard.map((rows, row) => (
        <View key={row} style={[styles.cellRow, styles.cellMarginColor]}>
          {rows.map((_, col) => (
            <SudokuCell
              key={col}
              id={id}
              userId={hasUserBoard ? userId : null}
              col={col}
              row={row}
              cellSize={cellSize}
              isPressable={isPressable}
              style={[
                cellStyles.cellBottomAndRight,
                col === 0 ? cellStyles.cellLeft : null,
                row === 0 ? cellStyles.cellTop : null,
                col !== boardSize - 1 && col % rootSize == 2
                  ? cellStyles.cellSepRight
                  : null,
                row !== boardSize - 1 && row % rootSize == 2
                  ? cellStyles.cellSepBottom
                  : null,
              ]}
              backgroundColor={white}
              opacityColor={blue}
              textColor={black}
              pressTextColor={white}
              noSelectedColor={noSelectedColor}
            />
          ))}
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
  noSelectedColor?: boolean;
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
  cellMarginColor: {
    backgroundColor: black,
  },
});

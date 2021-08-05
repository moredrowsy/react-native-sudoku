import React, { useCallback } from 'react';
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { connect, ConnectedProps } from 'react-redux';
import {
  AppDispatch,
  resetSudokuGameFromUserAsync,
  RootState,
  updateSudokuGameValueAsync,
} from '../../storage/store';
import { cellStyles, SUDOKU_CELL_NORMAL_MARGIN } from '../../styles/sudoku';
import {
  CellEntity,
  ControllCellEntity,
  getAvailableCells,
  getCellSize,
  makeEmptySudokuRow,
  SUDOKU_EMPTY_CELL,
} from '../../sudoku';
import { black, blue, red, white } from '../../styles';
import ControllerCell from './ControllerCell';

function Controller({ selectedCell, sudoku, userId, dispatch }: Props) {
  if (sudoku) {
    const { col, row } = selectedCell;
    const { board } = sudoku;
    const boardSize = board.length;
    const { width, height } = Dimensions.get('window');
    const dimension = Math.min(width, height);
    const cellSize = getCellSize(
      dimension,
      boardSize,
      SUDOKU_CELL_NORMAL_MARGIN
    );
    const isComplete = sudoku.userScore === boardSize * boardSize;
    const rows = makeEmptySudokuRow(boardSize);

    let unique = new Set<number>();
    let sudokuCells: ControllCellEntity[] = [];
    if (col > -1 && col < boardSize && row > -1 && row < boardSize) {
      unique = getAvailableCells(col, row, board);
      sudokuCells = rows.map((value) => ({
        value,
        unique: unique.has(value),
      }));
    }

    const onCellPress = (value: number) => {
      if (col > -1 && row > -1 && userId) {
        const cellValue = board[row][col].value;
        if (cellValue !== value) {
          dispatch(
            updateSudokuGameValueAsync({
              userId,
              sudokuId: sudoku.id,
              col,
              row,
              value,
            })
          );
        }
      }
    };

    const onCellClear = () => {
      if (col > -1 && row > -1 && userId) {
        const cellValue = board[row][col].value;
        if (cellValue !== SUDOKU_EMPTY_CELL) {
          dispatch(
            updateSudokuGameValueAsync({
              userId,
              sudokuId: sudoku.id,
              col,
              row,
              value: SUDOKU_EMPTY_CELL,
            })
          );
        }
      }
    };

    const onReset = () => {
      if (userId)
        dispatch(resetSudokuGameFromUserAsync({ userId, sudokuId: sudoku.id }));
    };

    return (
      <View style={[styles.container]}>
        <View
          style={[
            styles.control,
            { height: cellSize + SUDOKU_CELL_NORMAL_MARGIN * 2 },
            isComplete && styles.noDisplay,
            styles.cellMarginColor,
          ]}
        >
          {unique &&
            sudokuCells.map((cell, index) => (
              <ControllerCell
                key={index}
                col={col}
                row={row}
                value={cell.value}
                cellSize={cellSize}
                isPressable={cell.unique}
                style={[
                  cellStyles.cellBottomAndRight,
                  cellStyles.cellTop,
                  index === 0 ? cellStyles.cellLeft : null,
                ]}
                backgroundColor={white}
                opacityColor={blue}
                textColor={black}
                pressTextColor={white}
                onPress={() => onCellPress(cell.value)}
              />
            ))}
        </View>
        <View style={styles.control}>
          <TouchableOpacity onPress={onCellClear} style={styles.btn}>
            <AntDesign name='closesquareo' size={cellSize * 1.2} color={red} />
          </TouchableOpacity>
          <View style={{ width: cellSize, height: cellSize }}></View>
          <TouchableOpacity onPress={onReset} style={styles.btn}>
            <MaterialCommunityIcons
              name='restart'
              size={cellSize * 1.2}
              color={blue}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  } else {
    return <View></View>;
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  control: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDisplay: {
    opacity: 0,
  },
  btn: {
    marginTop: 10,
  },
  cellRow: {
    flexDirection: 'row',
  },
  cellMarginColor: {
    backgroundColor: black,
  },
});

interface OwnProps {
  id: string;
  userId: string | null;
}

const mapState = ({ users }: RootState, { id, userId }: OwnProps) => {
  let selectedCell: CellEntity = { col: -1, row: -1 };
  let sudoku = null;

  if (id && userId && userId in users && id in users[userId].sudokus) {
    selectedCell = users[userId].sudokus[id].selectedCell;
    sudoku = users[userId].sudokus[id];
  }

  return {
    selectedCell,
    sudoku,
    userId,
  };
};

const mapDispatch = (dispatch: AppDispatch) => ({
  dispatch,
});

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = OwnProps & PropsFromRedux;

export default connect(mapState)(Controller);

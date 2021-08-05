import React from 'react';
import { StyleProp, View } from 'react-native';
import { connect, ConnectedProps } from 'react-redux';
import {
  AppDispatch,
  RootState,
  updateSelectedCellForGame,
} from '../../storage/store';
import { blue, white } from '../../styles';
import { SUDOKU_EMPTY_CELL } from '../../sudoku';
import { CellEntity } from '.././../types';
import Cell from './Cell';

function SudokuCell({
  id,
  sudokuCell,
  col,
  row,
  userId,
  cellSize,
  isPressable = true,
  backgroundColor,
  opacityColor,
  textColor,
  pressTextColor,
  style,
  isSelected,
  noSelectedColor = false,
  dispatch,
}: Props) {
  let bgColor = backgroundColor;
  let txtColor = textColor;

  if (isSelected) {
    bgColor = blue;
    txtColor = white;
  }

  if (noSelectedColor) {
    bgColor = backgroundColor;
    txtColor = textColor;
  }

  if (
    sudokuCell &&
    sudokuCell.mutable &&
    sudokuCell.value !== SUDOKU_EMPTY_CELL
  ) {
    bgColor = blue;
    txtColor = white;
  }

  const onCellPress = () => {
    if (id && userId) {
      // Unselect cell if it is already selected
      // Otherwise, set selected cell as this row, col
      const cell = isSelected ? { col: -1, row: -1 } : { col, row };

      const payload: { userId: string; sudokuId: string; cell: CellEntity } = {
        userId: userId,
        sudokuId: id,
        cell,
      };
      dispatch(updateSelectedCellForGame(payload));
    }
  };

  return (
    <View style={style}>
      {sudokuCell && (
        <Cell
          value={sudokuCell.value}
          isPressable={isPressable && sudokuCell.mutable}
          cellSize={cellSize}
          backgroundColor={bgColor}
          opacityColor={opacityColor}
          textColor={txtColor}
          pressTextColor={pressTextColor}
          onPress={onCellPress}
        />
      )}
    </View>
  );
}

interface OwnProps {
  id: string;
  userId: string | undefined | null;
  col: number;
  row: number;
  cellSize: number;
  isPressable: boolean;
  backgroundColor?: string;
  opacityColor?: string;
  textColor?: string;
  pressTextColor?: string;
  noSelectedColor?: boolean;
  style?: StyleProp<any>;
}

const mapState = (
  { sudokus, users }: RootState,
  { id, userId, col, row }: OwnProps
) => {
  if (userId && userId in users && id in users[userId].sudokus) {
    const sudokuCell = users[userId].sudokus[id].board[row][col];
    const selectedCell = users[userId].sudokus[id].selectedCell;
    return {
      sudokuCell: sudokuCell,
      isSelected: col === selectedCell.col && row === selectedCell.row,
    };
  } else {
    return {
      sudokuCell: id in sudokus ? sudokus[id].board[row][col] : null,
      isSelected: false,
    };
  }
};

const mapDispatch = (dispatch: AppDispatch) => ({
  dispatch,
});

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = OwnProps & PropsFromRedux;

export default connect(mapState)(SudokuCell);
export type SudokuCellType = ReturnType<typeof connect>;

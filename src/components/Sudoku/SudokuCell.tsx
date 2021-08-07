import React from 'react';
import { StyleProp, View } from 'react-native';
import { connect, ConnectedProps } from 'react-redux';
import {
  AppDispatch,
  RootState,
  updateSelectedCellForGame,
} from '../../storage/store';
import { SUDOKU_EMPTY_CELL } from '../../sudoku';
import { CellEntity } from '.././../types';
import Cell from './Cell';

function SudokuCell({
  id,
  userId,
  sudokuCell,
  col,
  row,
  cellSize,
  isPressable = true,
  style,
  isSelected,
  hideSelectedColor = false,
  theme,
  dispatch,
}: Props) {
  let bgColor = theme.colors.cellBackground;
  let opColor = theme.colors.cellOpacityBackground;
  let txtColor = theme.colors.cellText;

  if (isSelected) {
    bgColor = theme.colors.cellSelectedBackground;
    opColor = theme.colors.cellSelectedOpacity;
    txtColor = theme.colors.cellSelectedText;
  }

  if (hideSelectedColor) {
    bgColor = theme.colors.cellBackground;
    opColor = theme.colors.cellOpacityBackground;
    txtColor = theme.colors.cellText;
  }

  if (
    sudokuCell &&
    sudokuCell.mutable &&
    sudokuCell.value !== SUDOKU_EMPTY_CELL
  ) {
    bgColor = theme.colors.cellSelectedBackground;
    opColor = theme.colors.cellSelectedOpacity;
    txtColor = theme.colors.cellSelectedText;
  }

  const onCellPress = () => {
    if (id && userId && sudokuCell) {
      // Unselect cell if it is already selected
      // Otherwise, set selected cell as this row, col
      const cell = isSelected ? { col: -1, row: -1, value: -1 } : sudokuCell;

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
          opacityColor={opColor}
          textColor={txtColor}
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
  hideSelectedColor?: boolean;
  style?: StyleProp<any>;
}

const mapState = (
  { sudokus, theme, users }: RootState,
  { id, userId, col, row }: OwnProps
) => {
  if (userId && userId in users && id in users[userId].sudokus) {
    const sudokuCell = users[userId].sudokus[id].board[row][col];
    const selectedCell = users[userId].sudokus[id].selectedCell;
    return {
      sudokuCell: sudokuCell,
      isSelected: col === selectedCell.col && row === selectedCell.row,
      theme,
    };
  } else {
    return {
      sudokuCell: id in sudokus ? sudokus[id].board[row][col] : null,
      isSelected: false,
      theme,
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

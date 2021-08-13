import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import {
  AppDispatch,
  RootState,
  updateSelectedCellForGame,
} from '../../storage/store';
import { getIsCellInSelected, SUDOKU_EMPTY_CELL } from '../../sudoku';

import Cell from './Cell';

const SudokuCell: React.FC<Props> = ({
  id,
  userId,
  sudokuCell,
  dimension,
  hideSelectedColor = false,
  isPressable = true,
  isCellInSelected,
  isSelected,
  theme,
  dispatch,
}) => {
  let bgColor = theme.colors.background;
  let opColor = theme.colors.opacityBackground;
  let txtColor = theme.colors.text;

  if (isSelected) {
    bgColor = theme.colors.selectedBackground;
    opColor = theme.colors.selectedOpacity;
    txtColor = theme.colors.selectedText;
  } else if (isCellInSelected) {
    bgColor = theme.colors.highlightBackground;
    txtColor = theme.colors.highlightText;
  }

  if (hideSelectedColor) {
    bgColor = theme.colors.background;
    opColor = theme.colors.opacityBackground;
    txtColor = theme.colors.text;
  }

  if (
    sudokuCell &&
    sudokuCell.mutable &&
    sudokuCell.value !== SUDOKU_EMPTY_CELL
  ) {
    bgColor = theme.colors.selectedBackground;
    opColor = theme.colors.selectedOpacity;
    txtColor = theme.colors.selectedText;
  }

  const onCellPress = () => {
    if (id && userId && sudokuCell) {
      // Unselect cell if it is already selected
      // Otherwise, set selected cell as this row, col
      const cell = isSelected ? null : sudokuCell;

      dispatch(
        updateSelectedCellForGame({
          selectedCell: cell,
          sudokuId: id,
          userId: userId,
        })
      );
    }
  };

  return (
    <Cell
      value={sudokuCell.value}
      backgroundColor={bgColor}
      opacityColor={opColor}
      textColor={txtColor}
      dimension={dimension}
      isPressable={isPressable && sudokuCell.mutable}
      onPress={onCellPress}
    />
  );
};

type OwnProps = {
  id: string;
  userId?: string;
  col: number;
  row: number;
  dimension: number;
  hideSelectedColor?: boolean;
  isPressable?: boolean;
};

const mapState = (
  { sudokus, theme, users }: RootState,
  { id, userId, col, row }: OwnProps
) => {
  if (userId && users[userId]?.sudokus[id]) {
    const sudoku = users[userId].sudokus[id];
    const boardSize = sudoku.board.length;
    const sudokuCell = sudoku.board[row][col];
    const selectedCell = sudoku.selectedCell;
    const isCellInSelected = getIsCellInSelected(
      sudokuCell,
      selectedCell,
      boardSize
    );

    return {
      sudokuCell: sudokuCell,
      isCellInSelected,
      isSelected: selectedCell
        ? col === selectedCell.col && row === selectedCell.row
        : false,
      theme,
    };
  } else {
    return {
      sudokuCell: sudokus[id]?.board[row][col],
      isCellInSelected: false,
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

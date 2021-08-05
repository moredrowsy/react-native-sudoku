import { StyleSheet } from 'react-native';

export const SUDOKU_CELL_NORMAL_MARGIN = 1;
export const SUDOKU_CELL_SEP_MARGIN = 3;

export const cellStyles = StyleSheet.create({
  cellBottomAndRight: {
    marginBottom: SUDOKU_CELL_NORMAL_MARGIN,
    marginRight: SUDOKU_CELL_NORMAL_MARGIN,
  },
  cellLeft: {
    marginLeft: SUDOKU_CELL_NORMAL_MARGIN,
  },
  cellTop: {
    marginTop: SUDOKU_CELL_NORMAL_MARGIN,
  },
  cellSepRight: {
    marginRight: SUDOKU_CELL_SEP_MARGIN,
  },
  cellSepBottom: {
    marginBottom: SUDOKU_CELL_SEP_MARGIN,
  },
});

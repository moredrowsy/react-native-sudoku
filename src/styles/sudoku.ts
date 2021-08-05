import { StyleSheet } from 'react-native';
import { CellColors } from '../sudoku';
import { black, blue, white } from './colors';

export const SUDOKU_CELL_NORMAL_MARGIN = 1;
export const SUDOKU_CELL_SEP_MARGIN = 3;

const cellColorThemes: Record<string, CellColors> = {
  blue: {
    background: white,
    opacityBackground: blue,
    text: black,
    margin: black,
    selectedBackground: blue,
    selectedOpacity: white,
    selectedTextColor: white,
  },
};
cellColorThemes['default'] = cellColorThemes.blue;
export { cellColorThemes };

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

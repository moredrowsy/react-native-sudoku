import { StyleSheet } from 'react-native';
import { CellColors } from '../sudoku';
import { black, blue, red, white } from './colors';

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
    selectedText: white,
    revealBackground: red,
    revealOpacityBackground: red,
    revealText: white,
  },
};
cellColorThemes['default'] = cellColorThemes.blue;
export { cellColorThemes };

export const cellStyles = StyleSheet.create({
  cellNormBox: {
    marginTop: SUDOKU_CELL_NORMAL_MARGIN,
    marginBottom: SUDOKU_CELL_NORMAL_MARGIN,
    marginRight: SUDOKU_CELL_NORMAL_MARGIN,
    marginLeft: SUDOKU_CELL_NORMAL_MARGIN,
  },
  cellNormLeft: {
    marginLeft: SUDOKU_CELL_NORMAL_MARGIN,
  },
  cellNormTop: {
    marginTop: SUDOKU_CELL_NORMAL_MARGIN,
  },
  cellNormBottomRight: {
    marginBottom: SUDOKU_CELL_NORMAL_MARGIN,
    marginRight: SUDOKU_CELL_NORMAL_MARGIN,
  },
  cellNormTopBottomRight: {
    marginTop: SUDOKU_CELL_NORMAL_MARGIN,
    marginBottom: SUDOKU_CELL_NORMAL_MARGIN,
    marginRight: SUDOKU_CELL_NORMAL_MARGIN,
  },
  cellNormTopBottomSepRight: {
    marginTop: SUDOKU_CELL_NORMAL_MARGIN,
    marginBottom: SUDOKU_CELL_NORMAL_MARGIN,
    marginRight: SUDOKU_CELL_SEP_MARGIN,
  },
  cellSepRight: {
    marginRight: SUDOKU_CELL_SEP_MARGIN,
  },
  cellSepRightNormBottom: {
    marginRight: SUDOKU_CELL_SEP_MARGIN,
    marginBottom: SUDOKU_CELL_NORMAL_MARGIN,
  },
  cellSepBottom: {
    marginBottom: SUDOKU_CELL_SEP_MARGIN,
  },
  cellSepBottomNormRight: {
    marginRight: SUDOKU_CELL_NORMAL_MARGIN,
    marginBottom: SUDOKU_CELL_SEP_MARGIN,
  },

  cellSepBottomRight: {
    marginRight: SUDOKU_CELL_SEP_MARGIN,
    marginBottom: SUDOKU_CELL_SEP_MARGIN,
  },
});

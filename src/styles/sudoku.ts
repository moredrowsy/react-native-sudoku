import { StyleSheet } from 'react-native';
import { CellColors } from '../styles';
import { GAP_BETWEEN_COMPONENTS } from '../sudoku';
import { black, blue, gray, red, white, yellow } from './colors';

export const SUDOKU_CELL_NORMAL_MARGIN = 1;
export const SUDOKU_CELL_SEP_MARGIN = 3;

const cellColorTheme: Record<string, CellColors> = {
  black: {
    primary: black,
    secondary: white,
    inactive: gray,
    cellText: black,
    cellMargin: black,
    cellBackground: white,
    cellOpacityBackground: black,
    cellSelectedBackground: black,
    cellSelectedOpacity: white,
    cellSelectedText: white,
    cellRevealBackground: red,
    cellRevealOpacityBackground: red,
    cellRevealText: white,
    remove: black,
    reset: black,
    reveal: red,
    showHints: yellow,
  },
  blue: {
    primary: blue,
    secondary: white,
    inactive: gray,
    cellText: black,
    cellMargin: black,
    cellBackground: white,
    cellOpacityBackground: blue,
    cellSelectedBackground: blue,
    cellSelectedOpacity: white,
    cellSelectedText: white,
    cellRevealBackground: red,
    cellRevealOpacityBackground: red,
    cellRevealText: white,
    remove: blue,
    reset: blue,
    reveal: black,
    showHints: yellow,
  },
};
cellColorTheme['default'] = cellColorTheme.blue;
export { cellColorTheme };

export const cellMargins = StyleSheet.create({
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
  // Start control cells cellMargin for portrait
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
  // End control cells cellMargin for portrait
  // Start control cells cellMargin for landscape
  cellNormLeftRightBottom: {
    marginLeft: SUDOKU_CELL_NORMAL_MARGIN,
    marginRight: SUDOKU_CELL_NORMAL_MARGIN,
    marginBottom: SUDOKU_CELL_NORMAL_MARGIN,
  },
  cellNormLeftRightSepBottom: {
    marginLeft: SUDOKU_CELL_NORMAL_MARGIN,
    marginRight: SUDOKU_CELL_NORMAL_MARGIN,
    marginBottom: SUDOKU_CELL_SEP_MARGIN,
  },
  // End control cells cellMargin for landscape
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

export function createCellStylesLandscape(themeName: string) {
  const styles = StyleSheet.create({
    cellRows: {
      flexDirection: 'row',
      backgroundColor: cellColorTheme[themeName].cellMargin,
    },
    sudokuContainer: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      alignItems: 'center',
    },
    sudokuContainerForBoard: {
      marginLeft: GAP_BETWEEN_COMPONENTS,
      marginRight: GAP_BETWEEN_COMPONENTS,
    },
    sudokuContainerForController: {
      marginRight: GAP_BETWEEN_COMPONENTS,
    },
    sudokuContainerForInfo: {
      marginLeft: GAP_BETWEEN_COMPONENTS,
    },
    board: {
      paddingTop: SUDOKU_CELL_NORMAL_MARGIN,
      paddingLeft: SUDOKU_CELL_NORMAL_MARGIN,
      backgroundColor: cellColorTheme[themeName].cellMargin,
    },
    controllContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    controlCellsContainer: {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: cellColorTheme[themeName].cellMargin,
      marginLeft: 10,
      marginRight: 10,
    },
    controlCellsContainerHide: {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: cellColorTheme[themeName].cellMargin,
      marginLeft: 10,
      marginRight: 10,
      opacity: 0,
    },
    controlBtnContainer: {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 10,
    },
    controlBtnContainerHide: {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      opacity: 0,
      marginRight: 10,
    },
  });

  return { ...cellMargins, ...styles };
}

export function createCellStylesPortrait(themeName: string) {
  const styles = StyleSheet.create({
    cellRows: {
      flexDirection: 'row',
      backgroundColor: cellColorTheme[themeName].cellMargin,
    },
    sudokuContainer: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'space-evenly',
      alignItems: 'center',
    },
    sudokuContainerForBoard: {
      marginTop: GAP_BETWEEN_COMPONENTS,
      marginBottom: GAP_BETWEEN_COMPONENTS,
    },
    sudokuContainerForController: {
      marginBottom: GAP_BETWEEN_COMPONENTS,
    },
    sudokuContainerForInfo: {
      marginTop: GAP_BETWEEN_COMPONENTS,
    },
    board: {
      paddingTop: SUDOKU_CELL_NORMAL_MARGIN,
      paddingLeft: SUDOKU_CELL_NORMAL_MARGIN,
      backgroundColor: cellColorTheme[themeName].cellMargin,
    },
    controllContainer: {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    controlCellsContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: cellColorTheme[themeName].cellMargin,
      marginTop: 10,
      marginBottom: 10,
    },
    controlCellsContainerHide: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: cellColorTheme[themeName].cellMargin,
      marginTop: 10,
      marginBottom: 10,
      opacity: 0,
    },
    controlBtnContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 10,
    },
    controlBtnContainerHide: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      opacity: 0,
      marginBottom: 10,
    },
  });

  return { ...cellMargins, ...styles };
}

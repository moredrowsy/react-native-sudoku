import { ViewStyle } from 'react-native';

export interface CellColors {
  primary: string;
  secondary: string;
  inactive: string;
  cellText: string;
  cellMargin: string;
  cellBackground: string;
  cellOpacityBackground: string;
  cellSelectedBackground: string;
  cellSelectedOpacity: string;
  cellSelectedText: string;
  cellRevealBackground: string;
  cellRevealOpacityBackground: string;
  cellRevealText: string;
  remove: string;
  reset: string;
  reveal: string;
  showHints: string;
}

export interface CellStyles {
  cellNormBox: ViewStyle;
  cellNormLeft: ViewStyle;
  cellNormTop: ViewStyle;
  cellNormBottomRight: ViewStyle;
  cellNormTopBottomRight: ViewStyle;
  cellNormTopBottomSepRight: ViewStyle;
  cellNormLeftRightBottom: ViewStyle;
  cellNormLeftRightSepBottom: ViewStyle;
  cellSepRight: ViewStyle;
  cellSepRightNormBottom: ViewStyle;
  cellSepBottom: ViewStyle;
  cellSepBottomNormRight: ViewStyle;
  cellSepBottomRight: ViewStyle;
  cellRows: ViewStyle;
  sudokuContainer: ViewStyle;
  sudokuContainerForBoard: ViewStyle;
  sudokuContainerForController: ViewStyle;
  sudokuContainerForInfo: ViewStyle;
  board: ViewStyle;
  controlCellsContainer: ViewStyle;
  controlCellsContainerHide: ViewStyle;
  controllContainer: ViewStyle;
  controlBtnContainer: ViewStyle;
  controlBtnContainerHide: ViewStyle;
}

export interface Theme {
  colors: CellColors;
  portrait: CellStyles;
  landscape: CellStyles;
}

export type ThemeNames =
  | 'amber'
  | 'black'
  | 'blue'
  | 'blueGrey'
  | 'cyan'
  | 'deepPurple'
  | 'green'
  | 'indigo'
  | 'pink'
  | 'purple'
  | 'red'
  | 'teal';

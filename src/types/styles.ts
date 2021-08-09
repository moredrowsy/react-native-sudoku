import { StatusBarStyle, ViewStyle } from 'react-native';

export interface CellColors {
  primary: string;
  secondary: string;
  inactive: string;
  text: string;
  margin: string;
  background: string;
  opacityBackground: string;
  selectedBackground: string;
  selectedOpacity: string;
  selectedText: string;
  revealBackground: string;
  revealOpacityBackground: string;
  revealText: string;
  highlightBackground: string;
  highlightText: string;
  remove: string;
  reset: string;
  reveal: string;
  showHints: string;
  barStyle: StatusBarStyle;
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
  flatListItem: ViewStyle;
  flatListFirstItem: ViewStyle;
  flatListItemSelected: ViewStyle;
  flatListFirstItemSelected: ViewStyle;
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

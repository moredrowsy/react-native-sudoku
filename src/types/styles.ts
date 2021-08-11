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
  sudokuContainer: ViewStyle;
  sudokuContainerForGrid: ViewStyle;
  sudokuContainerForController: ViewStyle;
  sudokuContainerForInfo: ViewStyle;
  // Grid
  gridContainer: ViewStyle;
  gridRowContainer: ViewStyle;
  gridColContainer: ViewStyle;
  gridColContainerSubBottom: ViewStyle;
  gridColContainerSubRight: ViewStyle;
  gridColFirstCol: ViewStyle;
  gridColFirstColSubBottom: ViewStyle;
  gridColFirstRow: ViewStyle;
  gridColFirstRowSubRight: ViewStyle;
  gridColTopLeft: ViewStyle;
  gridColCornerSubRightBottom: ViewStyle;
  // Controller.tsx styles
  controlCellsContainer: ViewStyle;
  controlCellsContainerHide: ViewStyle;
  controllContainer: ViewStyle;
  controlBtnContainer: ViewStyle;
  controlBtnContainerHide: ViewStyle;
  // Flatlist
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

import {
  cellColorTheme,
  createCellStylesLandscape,
  createCellStylesPortrait,
} from './sudoku';
import { Theme } from './types';

export const themes: Record<ThemeNames, Theme> = {
  black: {
    colors: cellColorTheme['black'],
    landscape: createCellStylesLandscape('black'),
    portrait: createCellStylesPortrait('black'),
  },
  blue: {
    colors: cellColorTheme['blue'],
    landscape: createCellStylesLandscape('blue'),
    portrait: createCellStylesPortrait('blue'),
  },
};

export const themeNames: ThemeNames[] = ['black', 'blue'];

export type ThemeNames = 'black' | 'blue';

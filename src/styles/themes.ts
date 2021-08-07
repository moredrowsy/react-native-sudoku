import {
  cellColorTheme,
  createCellStylesLandscape,
  createCellStylesPortrait,
} from './sudoku';
import { Theme, ThemeNames } from '../types';

export const themes: Record<ThemeNames, Theme> = {
  amber: {
    colors: cellColorTheme['amber'],
    landscape: createCellStylesLandscape('amber'),
    portrait: createCellStylesPortrait('amber'),
  },
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
  blueGrey: {
    colors: cellColorTheme['blueGrey'],
    landscape: createCellStylesLandscape('blueGrey'),
    portrait: createCellStylesPortrait('blueGrey'),
  },
  cyan: {
    colors: cellColorTheme['cyan'],
    landscape: createCellStylesLandscape('cyan'),
    portrait: createCellStylesPortrait('cyan'),
  },
  deepPurple: {
    colors: cellColorTheme['deepPurple'],
    landscape: createCellStylesLandscape('deepPurple'),
    portrait: createCellStylesPortrait('deepPurple'),
  },
  green: {
    colors: cellColorTheme['green'],
    landscape: createCellStylesLandscape('green'),
    portrait: createCellStylesPortrait('green'),
  },
  indigo: {
    colors: cellColorTheme['indigo'],
    landscape: createCellStylesLandscape('indigo'),
    portrait: createCellStylesPortrait('indigo'),
  },
  pink: {
    colors: cellColorTheme['pink'],
    landscape: createCellStylesLandscape('pink'),
    portrait: createCellStylesPortrait('pink'),
  },
  purple: {
    colors: cellColorTheme['purple'],
    landscape: createCellStylesLandscape('purple'),
    portrait: createCellStylesPortrait('purple'),
  },
  red: {
    colors: cellColorTheme['red'],
    landscape: createCellStylesLandscape('red'),
    portrait: createCellStylesPortrait('red'),
  },
  teal: {
    colors: cellColorTheme['teal'],
    landscape: createCellStylesLandscape('teal'),
    portrait: createCellStylesPortrait('teal'),
  },
};

export const themeNames = Object.keys(themes) as ThemeNames[];

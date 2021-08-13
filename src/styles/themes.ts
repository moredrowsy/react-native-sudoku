import {
  cellColorTheme,
  createCellStylesLandscape,
  createCellStylesPortrait,
} from './sudoku';
import { Theme, ThemeNames } from '../types';

export const themes: Record<ThemeNames, Theme> = {
  amber: {
    name: 'amber',
    colors: cellColorTheme['amber'],
    landscape: createCellStylesLandscape('amber'),
    portrait: createCellStylesPortrait('amber'),
  },
  black: {
    name: 'black',
    colors: cellColorTheme['black'],
    landscape: createCellStylesLandscape('black'),
    portrait: createCellStylesPortrait('black'),
  },
  blue: {
    name: 'blue',
    colors: cellColorTheme['blue'],
    landscape: createCellStylesLandscape('blue'),
    portrait: createCellStylesPortrait('blue'),
  },
  blueGrey: {
    name: 'blueGrey',
    colors: cellColorTheme['blueGrey'],
    landscape: createCellStylesLandscape('blueGrey'),
    portrait: createCellStylesPortrait('blueGrey'),
  },
  cyan: {
    name: 'cyan',
    colors: cellColorTheme['cyan'],
    landscape: createCellStylesLandscape('cyan'),
    portrait: createCellStylesPortrait('cyan'),
  },
  deepPurple: {
    name: 'deepPurple',
    colors: cellColorTheme['deepPurple'],
    landscape: createCellStylesLandscape('deepPurple'),
    portrait: createCellStylesPortrait('deepPurple'),
  },
  green: {
    name: 'green',
    colors: cellColorTheme['green'],
    landscape: createCellStylesLandscape('green'),
    portrait: createCellStylesPortrait('green'),
  },
  indigo: {
    name: 'indigo',
    colors: cellColorTheme['indigo'],
    landscape: createCellStylesLandscape('indigo'),
    portrait: createCellStylesPortrait('indigo'),
  },
  pink: {
    name: 'pink',
    colors: cellColorTheme['pink'],
    landscape: createCellStylesLandscape('pink'),
    portrait: createCellStylesPortrait('pink'),
  },
  purple: {
    name: 'purple',
    colors: cellColorTheme['purple'],
    landscape: createCellStylesLandscape('purple'),
    portrait: createCellStylesPortrait('purple'),
  },
  red: {
    name: 'red',
    colors: cellColorTheme['red'],
    landscape: createCellStylesLandscape('red'),
    portrait: createCellStylesPortrait('red'),
  },
  teal: {
    name: 'teal',
    colors: cellColorTheme['teal'],
    landscape: createCellStylesLandscape('teal'),
    portrait: createCellStylesPortrait('teal'),
  },
};

export const themeNames = Object.keys(themes) as ThemeNames[];

import React from 'react';
import { StyleProp, View } from 'react-native';
import { connect, ConnectedProps } from 'react-redux';
import { AppDispatch, RootState } from '../../storage/store';

import Cell from './Cell';

function SudokuCell({
  col,
  row,
  value,
  cellSize,
  isPressable = true,
  isReveal = false,
  isAnswer,
  appShowHints,
  showHints,
  style,
  onPress,
  theme,
  dispatch,
}: Props) {
  let bgColor = theme.colors.cellBackground;
  let opColor = theme.colors.cellOpacityBackground;
  let txtColor = theme.colors.cellText;

  if (isPressable && appShowHints && showHints) {
    bgColor = theme.colors.cellSelectedBackground;
    opColor = theme.colors.cellSelectedOpacity;
    txtColor = theme.colors.cellSelectedText;
  }

  if (isReveal && isAnswer) {
    bgColor = theme.colors.cellRevealBackground;
    opColor = theme.colors.cellRevealOpacityBackground;
    txtColor = theme.colors.cellRevealText;
  }

  return (
    <View style={style}>
      <Cell
        value={value}
        isPressable={isPressable}
        cellSize={cellSize}
        backgroundColor={bgColor}
        opacityColor={opColor}
        textColor={txtColor}
        onPress={onPress ? onPress : () => {}}
      />
    </View>
  );
}

interface OwnProps {
  id: string;
  userId?: string | null;
  col: number;
  row: number;
  value: number;
  cellSize: number;
  isPressable: boolean;
  isReveal: boolean;
  onPress?: () => void;
  style?: StyleProp<any>;
}

const mapState = (
  { options, theme, users }: RootState,
  { id, col, row, userId, value }: OwnProps
) => {
  let isAnswer = false;
  let showHints = false;
  if (col > -1 && row > -1 && userId && id in users[userId].sudokus) {
    isAnswer = users[userId].sudokus[id].board[row][col].answer === value;
    showHints = users[userId].sudokus[id].showHints;
  }

  return {
    isAnswer,
    appShowHints: options.showHints,
    showHints,
    theme,
  };
};

const mapDispatch = (dispatch: AppDispatch) => ({
  dispatch,
});

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = OwnProps & PropsFromRedux;

export default connect(mapState)(SudokuCell);
export type SudokuCellType = ReturnType<typeof connect>;

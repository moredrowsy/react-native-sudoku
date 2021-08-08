import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { connect, ConnectedProps } from 'react-redux';
import { AppDispatch, RootState } from '../../storage/store';

import Cell from './Cell';

const SudokuCell: React.FC<Props> = ({
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
}) => {
  let bgColor = theme.colors.background;
  let opColor = theme.colors.opacityBackground;
  let txtColor = theme.colors.text;

  if (isPressable && appShowHints && showHints) {
    bgColor = theme.colors.selectedBackground;
    opColor = theme.colors.selectedOpacity;
    txtColor = theme.colors.selectedText;
  }

  if (isReveal && isAnswer) {
    bgColor = theme.colors.revealBackground;
    opColor = theme.colors.revealOpacityBackground;
    txtColor = theme.colors.revealText;
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
        onPress={onPress}
      />
    </View>
  );
};

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
  style?: StyleProp<ViewStyle>;
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

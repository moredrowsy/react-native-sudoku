import React from 'react';
import { StyleProp, View } from 'react-native';
import { connect, ConnectedProps } from 'react-redux';
import { AppDispatch, RootState } from '../../storage/store';
import { cellColorThemes } from '../../styles';
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
  dispatch,
}: Props) {
  const cellColors = cellColorThemes.default;

  let bgColor = cellColors.background;
  let opColor = cellColors.opacityBackground;
  let txtColor = cellColors.text;

  if (isPressable && appShowHints && showHints) {
    bgColor = cellColors.selectedBackground;
    opColor = cellColors.selectedOpacity;
    txtColor = cellColors.selectedText;
  }

  if (isReveal && isAnswer) {
    bgColor = cellColors.revealBackground;
    opColor = cellColors.revealOpacityBackground;
    txtColor = cellColors.revealText;
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
  { options, users }: RootState,
  { id, col, row, isReveal, userId, value }: OwnProps
) => {
  let isAnswer = false;
  let showHints = false;
  if (userId && id in users[userId].sudokus) {
    isAnswer = users[userId].sudokus[id].board[row][col].answer === value;
    showHints = users[userId].sudokus[id].showHints;
  }

  return {
    isAnswer,
    appShowHints: options.showHints,
    showHints,
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

import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { connect, ConnectedProps } from 'react-redux';
import { AppDispatch, RootState } from '../../../storage/store';
import { SudokuCellEntity } from '../../../types';

import Cell from '../Cell';

const GameControllerCell: React.FC<Props> = ({
  value,
  dimension,
  isPressable = true,
  isReveal = false,
  isAnswer,
  appShowHints,
  showHints,
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
    <Cell
      value={value}
      backgroundColor={bgColor}
      opacityColor={opColor}
      textColor={txtColor}
      dimension={dimension}
      isPressable={isPressable}
      onPress={onPress}
    />
  );
};

type OwnProps = {
  id: string;
  userId: string;
  selectedCell: SudokuCellEntity | null;
  value: number;
  dimension: number;
  isPressable: boolean;
  isReveal: boolean;
  onPress?: () => void;
};

const mapState = (
  { options, theme, users }: RootState,
  { id, selectedCell, userId, value }: OwnProps
) => {
  let isAnswer;
  if (selectedCell)
    isAnswer =
      users[userId].sudokus[id].board[selectedCell.row][selectedCell.col]
        .answer === value;

  return {
    isAnswer,
    appShowHints: options.showHints,
    showHints: users[userId].sudokus[id].showHints,
    theme,
  };
};

const mapDispatch = (dispatch: AppDispatch) => ({
  dispatch,
});

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = OwnProps & PropsFromRedux;

export default connect(mapState)(GameControllerCell);

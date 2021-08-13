import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { connect, ConnectedProps } from 'react-redux';
import { AppDispatch, RootState } from '../../../storage/store';
import { SudokuCellEntity } from '../../../types';

import Cell from '../Cell';

const NewGameControllerCell: React.FC<Props> = ({
  value,
  dimension,
  isPressable = true,
  onPress,
  theme,
  dispatch,
}) => {
  let bgColor = theme.colors.background;
  let opColor = theme.colors.opacityBackground;
  let txtColor = theme.colors.text;

  if (isPressable) {
    bgColor = theme.colors.selectedBackground;
    opColor = theme.colors.selectedOpacity;
    txtColor = theme.colors.selectedText;
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
  selectedCell: SudokuCellEntity | null;
  value: number;
  dimension: number;
  isPressable: boolean;
  onPress?: () => void;
};

const mapState = ({ theme }: RootState, {}: OwnProps) => {
  return {
    theme,
  };
};

const mapDispatch = (dispatch: AppDispatch) => ({
  dispatch,
});

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = OwnProps & PropsFromRedux;

export default connect(mapState)(NewGameControllerCell);

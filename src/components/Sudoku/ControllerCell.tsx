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
  showHints,
  style,
  onPress,
  dispatch,
}: Props) {
  const cellColors = cellColorThemes.default;

  let bgColor = cellColors.background;
  let opColor = cellColors.opacityBackground;
  let txtColor = cellColors.text;

  if (isPressable && showHints) {
    bgColor = cellColors.selectedBackground;
    opColor = cellColors.selectedOpacity;
    txtColor = cellColors.selectedTextColor;
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
  col: number;
  row: number;
  value: number;
  cellSize: number;
  isPressable: boolean;
  onPress?: () => void;
  style?: StyleProp<any>;
}

const mapState = ({ options }: RootState) => ({
  showHints: options.showHints,
});

const mapDispatch = (dispatch: AppDispatch) => ({
  dispatch,
});

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = OwnProps & PropsFromRedux;

export default connect(mapState)(SudokuCell);
export type SudokuCellType = ReturnType<typeof connect>;

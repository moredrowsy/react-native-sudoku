import React from 'react';
import { StyleProp, View } from 'react-native';
import { connect, ConnectedProps } from 'react-redux';
import { AppDispatch, RootState } from '../../storage/store';
import { blue, white } from '../../styles';
import Cell from './Cell';

function SudokuCell({
  col,
  row,
  value,
  cellSize,
  isPressable = true,
  backgroundColor,
  opacityColor,
  textColor,
  pressTextColor,
  style,
  onPress,
  dispatch,
}: Props) {
  return (
    <View style={style}>
      <Cell
        value={value}
        isPressable={isPressable}
        cellSize={cellSize}
        backgroundColor={isPressable ? blue : backgroundColor}
        opacityColor={opacityColor}
        textColor={isPressable ? white : textColor}
        pressTextColor={pressTextColor}
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
  backgroundColor?: string;
  opacityColor?: string;
  textColor?: string;
  pressTextColor?: string;
  onPress?: () => void;
  style?: StyleProp<any>;
}

const mapState = ({}: RootState) => ({});

const mapDispatch = (dispatch: AppDispatch) => ({
  dispatch,
});

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = OwnProps & PropsFromRedux;

export default connect(mapState)(SudokuCell);
export type SudokuCellType = ReturnType<typeof connect>;

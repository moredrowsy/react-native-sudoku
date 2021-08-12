import React, { JSXElementConstructor } from 'react';
import { TextStyle } from 'react-native';
import { ViewStyle } from 'react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SUDOKU_EMPTY_CELL } from '../../sudoku';

const Cell: React.FC<Props> = ({
  value,
  backgroundColor,
  opacityColor,
  textColor,
  dimension,
  hideEmpty = true,
  isPressable,
  onPress,
}) => {
  const outerContainer: ViewStyle = { backgroundColor: opacityColor };
  const innerContainer: ViewStyle = { backgroundColor: backgroundColor };
  const textStyle: TextStyle = {
    color: textColor,
    fontSize: dimension * 0.75,
  };

  const CellView: JSXElementConstructor<any> = isPressable
    ? TouchableOpacity
    : View;

  return (
    <View style={[styles.container, outerContainer]}>
      <CellView
        style={[styles.innerContainer, innerContainer]}
        onPress={onPress}
      >
        <Text style={[styles.textStyle, textStyle]}>
          {value === SUDOKU_EMPTY_CELL && hideEmpty ? ' ' : value}
        </Text>
      </CellView>
    </View>
  );
};

export default Cell;

type Props = {
  value: number;
  backgroundColor: string;
  opacityColor: string;
  textColor: string;
  dimension: number;
  hideEmpty?: boolean;
  isPressable: boolean;
  onPress?: () => void;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'stretch',
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  textStyle: {
    fontWeight: 'bold',
  },
});

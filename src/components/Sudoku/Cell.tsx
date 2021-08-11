import React from 'react';
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
  hideZero = true,
  isPressable,
  onPress,
}) => {
  const outerContainer: ViewStyle = { backgroundColor: opacityColor };
  const innerContainer: ViewStyle = { backgroundColor: backgroundColor };
  const textStyle: TextStyle = {
    color: textColor,
    fontSize: dimension * 0.75,
  };

  return (
    <View style={[styles.container, outerContainer]}>
      {isPressable ? (
        <TouchableOpacity
          style={[styles.innerContainer, innerContainer]}
          onPress={onPress}
        >
          <Text style={[styles.textStyle, textStyle]}>
            {value === SUDOKU_EMPTY_CELL ? ' ' : value}
          </Text>
        </TouchableOpacity>
      ) : (
        <View style={[styles.innerContainer, innerContainer]}>
          <Text style={[styles.textStyle, textStyle]}>
            {value === SUDOKU_EMPTY_CELL && hideZero ? ' ' : value}
          </Text>
        </View>
      )}
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
  hideZero?: boolean;
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

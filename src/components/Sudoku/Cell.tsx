import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SUDOKU_EMPTY_CELL } from '../../sudoku';

const Cell: React.FC<Props> = ({
  value,
  isPressable,
  cellSize,
  backgroundColor,
  opacityColor,
  textColor,
  onPress,
  hideZero = true,
}) => {
  const outerContainer = { backgroundColor: opacityColor };
  const innerContainer = { backgroundColor: backgroundColor };
  const textContainr = { color: textColor };

  return (
    <View style={[outerContainer, { height: cellSize, width: cellSize }]}>
      {isPressable ? (
        <TouchableOpacity
          style={[styles.innerContainer, innerContainer]}
          onPress={onPress}
        >
          <Text
            style={[
              styles.text,
              textContainr && textContainr,
              { fontSize: 0.75 * cellSize },
            ]}
          >
            {value === SUDOKU_EMPTY_CELL ? ' ' : value}
          </Text>
        </TouchableOpacity>
      ) : (
        <View style={[styles.innerContainer, innerContainer]}>
          <Text
            style={[
              styles.text,
              textContainr && textContainr,
              { fontSize: 0.75 * cellSize },
            ]}
          >
            {value === SUDOKU_EMPTY_CELL && hideZero ? ' ' : value}
          </Text>
        </View>
      )}
    </View>
  );
};

export default Cell;

interface Props {
  value: number;
  isPressable: boolean;
  cellSize: number;
  backgroundColor: string;
  opacityColor: string;
  textColor: string;
  onPress?: () => void;
  hideZero?: boolean;
}

const styles = StyleSheet.create({
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontWeight: 'bold',
  },
});

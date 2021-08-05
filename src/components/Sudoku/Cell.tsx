import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { black, blue, white } from '../../styles';
import { SUDOKU_EMPTY_CELL } from '../../sudoku';

function Cell({
  value,
  isPressable,
  cellSize,
  backgroundColor,
  opacityColor,
  textColor,
  onPress,
}: Props) {
  const outerContainer = opacityColor
    ? { backgroundColor: opacityColor }
    : null;
  const innerContainer = backgroundColor
    ? { backgroundColor: backgroundColor }
    : null;
  const textContainr = textColor ? { color: textColor } : null;

  return (
    <View
      style={[
        styles.outerContainer,
        outerContainer && outerContainer,
        { height: cellSize, width: cellSize },
      ]}
    >
      {isPressable ? (
        <TouchableOpacity
          style={[styles.innerContainer, innerContainer && innerContainer]}
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
        <View
          style={[
            styles.innerContainer,
            backgroundColor ? { backgroundColor: backgroundColor } : {},
          ]}
        >
          <Text
            style={[
              styles.text,
              textColor ? { color: textColor } : {},
              { fontSize: 0.75 * cellSize },
            ]}
          >
            {value === SUDOKU_EMPTY_CELL ? ' ' : value}
          </Text>
        </View>
      )}
    </View>
  );
}

export default Cell;
export type CellType = ReturnType<typeof Cell>;

interface Props {
  value: number;
  isPressable: boolean;
  cellSize: number;
  backgroundColor?: string;
  opacityColor?: string;
  textColor?: string;
  pressTextColor?: string;
  onPress: () => void;
}

const styles = StyleSheet.create({
  outerContainer: { backgroundColor: blue },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: white,
  },
  text: {
    color: black,
    fontWeight: 'bold',
  },
});

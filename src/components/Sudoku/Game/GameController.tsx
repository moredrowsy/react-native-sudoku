import React, { useState } from 'react';
import { Pressable, TouchableOpacity, View } from 'react-native';
import { connect, ConnectedProps } from 'react-redux';
import {
  AntDesign,
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';

import {
  AppDispatch,
  resetSudokuGameFromUserAsync,
  RootState,
  updateShowHintsForGameAsync,
  updateSudokuGameValueAsync,
} from '../../../storage/store';
import {
  getAvailableCells,
  EMPTY_BOARDS,
  SUDOKU_EMPTY_CELL,
} from '../../../sudoku';

import ControllerCell from './GameControllerCell';
import Grid, { GridItemProps } from '../Grid';

const GameController: React.FC<Props> = ({
  id,
  userId,
  boardDimension,
  isPortrait,
  options,
  showHints,
  selectedCell,
  sudoku,
  theme,
  dispatch,
}) => {
  const [reveal, setReveal] = useState(false);

  // Icon names
  let eyeIconName = reveal ? 'eye' : 'eye-off';
  if (!(sudoku.hasSolution && options.showReveal)) eyeIconName = 'eye-outline';
  let hintsIconName = showHints ? 'lightbulb' : 'lightbulb-off';
  if (!options.showHints) hintsIconName = 'lightbulb-off-outline';

  const { board } = sudoku;
  const boardSize = board.length;
  const cellDimension = boardDimension / boardSize;

  // Set screenStyles theme based on screen type
  const screenStyles = isPortrait ? theme.portrait : theme.landscape;

  // Produce control cells list and mark cells that have unique value
  // within col, row, and subgrid
  const emptyRows = EMPTY_BOARDS[boardSize][0];
  let unique = new Set<number>();
  if (selectedCell) {
    unique = getAvailableCells(selectedCell.col, selectedCell.row, board);
  }

  // Grid only accepts 2d array.
  const data = [emptyRows];

  const onCellPress = (value: number) => {
    if (selectedCell) {
      const cellValue = board[selectedCell.row][selectedCell.col].value;
      if (cellValue !== value) {
        dispatch(
          updateSudokuGameValueAsync({
            userId,
            sudokuId: sudoku.id,
            col: selectedCell.col,
            row: selectedCell.row,
            value,
          })
        );
      }
    }
  };

  const onCellClear = () => {
    if (selectedCell) {
      const cellValue = board[selectedCell.row][selectedCell.col].value;
      if (cellValue !== SUDOKU_EMPTY_CELL) {
        dispatch(
          updateSudokuGameValueAsync({
            userId,
            sudokuId: sudoku.id,
            col: selectedCell.col,
            row: selectedCell.row,
            value: SUDOKU_EMPTY_CELL,
          })
        );
      }
    }
  };

  const onReset = () => {
    if (userId)
      dispatch(resetSudokuGameFromUserAsync({ userId, sudokuId: sudoku.id }));
  };

  const toggleShowHints = () => {
    dispatch(
      updateShowHintsForGameAsync({
        sudokuId: id,
        userId: userId,
        showHints: !showHints,
      })
    );
  };

  const renderGridItem: React.FC<GridItemProps<number>> = ({ id, item }) => (
    <ControllerCell
      id={id}
      userId={userId}
      selectedCell={selectedCell}
      value={item + 1}
      dimension={cellDimension}
      isPressable={unique.has(item + 1)}
      isReveal={reveal}
      onPress={() => onCellPress(item + 1)}
    />
  );

  return (
    <View style={screenStyles.controllContainer}>
      <View
        style={
          selectedCell
            ? screenStyles.controlCellsContainer
            : screenStyles.controlCellsContainerHide
        }
      >
        <Grid
          id={id}
          colDimension={cellDimension}
          rowDimension={boardDimension}
          isPortrait={isPortrait}
          data={data}
          renderItem={renderGridItem}
        />
      </View>
      <View style={{ width: cellDimension, height: cellDimension }}></View>
      <View
        style={
          selectedCell
            ? screenStyles.controlBtnContainer
            : screenStyles.controlBtnContainerHide
        }
      >
        <TouchableOpacity
          onPress={onCellClear}
          disabled={!selectedCell || selectedCell.value === SUDOKU_EMPTY_CELL}
        >
          <AntDesign
            name='closesquareo'
            size={cellDimension}
            color={
              selectedCell && selectedCell.value !== SUDOKU_EMPTY_CELL
                ? theme.colors.remove
                : theme.colors.inactive
            }
          />
        </TouchableOpacity>
        <View style={{ width: cellDimension, height: cellDimension }}></View>

        <TouchableOpacity
          onPress={onReset}
          disabled={!selectedCell || sudoku.defaultScore == sudoku.userScore}
        >
          <MaterialCommunityIcons
            name='restart'
            size={cellDimension}
            color={
              sudoku.defaultScore === sudoku.userScore
                ? theme.colors.inactive
                : theme.colors.reset
            }
          />
        </TouchableOpacity>
        <View style={{ width: cellDimension, height: cellDimension }}></View>
        <Pressable
          onPressIn={() => setReveal(true)}
          onPressOut={() => setReveal(false)}
          disabled={
            !selectedCell || !(sudoku.hasSolution && options.showReveal)
          }
        >
          <Ionicons
            name={eyeIconName as any}
            size={cellDimension}
            color={
              sudoku.hasSolution && reveal && options.showReveal
                ? theme.colors.reveal
                : theme.colors.inactive
            }
          />
        </Pressable>
        <View style={{ width: cellDimension, height: cellDimension }}></View>
        <TouchableOpacity
          onPress={toggleShowHints}
          disabled={!selectedCell || !(options.showHints || showHints)}
        >
          <MaterialCommunityIcons
            name={hintsIconName as any}
            size={cellDimension}
            color={
              options.showHints && showHints
                ? theme.colors.showHints
                : theme.colors.inactive
            }
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

type OwnProps = {
  id: string;
  userId: string;
  boardDimension: number;
  isPortrait: boolean;
};

const mapState = (
  { options, theme, users }: RootState,
  { id, userId }: OwnProps
) => ({
  id,
  options,
  showHints: users[userId].sudokus[id].showHints,
  selectedCell: users[userId].sudokus[id].selectedCell,
  sudoku: users[userId].sudokus[id],
  theme,
  userId,
});

const mapDispatch = (dispatch: AppDispatch) => ({
  dispatch,
});

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = OwnProps & PropsFromRedux;

export default connect(mapState)(GameController);

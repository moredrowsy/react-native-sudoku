import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { connect, ConnectedProps } from 'react-redux';
import {
  AntDesign,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons';

import {
  AppDispatch,
  createNewSudokuGameAsync,
  resetNewSudokuGameAsync,
  RootState,
  updateNewSudokuGameValueAsync,
} from '../../../storage/store';
import {
  getAvailableCells,
  EMPTY_BOARDS,
  SUDOKU_EMPTY_CELL,
} from '../../../sudoku';

import Grid, { GridItemProps } from '../Grid';
import NewGameControllerCell from './NewGameControllerCell';

const NewGameController: React.FC<Props> = ({
  boardDimension,
  isBusy,
  isPortrait,
  onCheckSolution,
  selectedCell,
  sudoku,
  theme,
  dispatch,
}) => {
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

  // Icon names
  const eyeIconName = sudoku.hasSolution ? 'eye-check' : 'eye-minus';

  const onCellPress = (value: number) => {
    if (selectedCell) {
      const cellValue = board[selectedCell.row][selectedCell.col].value;
      if (cellValue !== value) {
        dispatch(
          updateNewSudokuGameValueAsync({
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
          updateNewSudokuGameValueAsync({
            col: selectedCell.col,
            row: selectedCell.row,
            value: SUDOKU_EMPTY_CELL,
          })
        );
      }
    }
  };

  const onCreate = () => {
    dispatch(createNewSudokuGameAsync());
  };

  const onReset = () => {
    dispatch(resetNewSudokuGameAsync());
  };

  const renderGridItem: React.FC<GridItemProps<number>> = ({ id, item }) => (
    <NewGameControllerCell
      selectedCell={selectedCell}
      value={item + 1}
      dimension={cellDimension}
      isPressable={unique.has(item + 1)}
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
          id={'NewGameController'}
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
          disabled={
            isBusy || !selectedCell || selectedCell.value === SUDOKU_EMPTY_CELL
          }
        >
          <AntDesign
            name='closesquareo'
            size={cellDimension}
            color={
              selectedCell &&
              selectedCell.value !== SUDOKU_EMPTY_CELL &&
              !isBusy
                ? theme.colors.remove
                : theme.colors.inactive
            }
          />
        </TouchableOpacity>
        <View style={{ width: cellDimension, height: cellDimension }}></View>
        <TouchableOpacity
          onPress={onReset}
          disabled={
            isBusy || !selectedCell || sudoku.defaultScore == sudoku.userScore
          }
        >
          <MaterialCommunityIcons
            name='restart'
            size={cellDimension}
            color={
              sudoku.defaultScore === sudoku.userScore || isBusy
                ? theme.colors.inactive
                : theme.colors.reset
            }
          />
        </TouchableOpacity>
        <View style={{ width: cellDimension, height: cellDimension }}></View>
        <TouchableOpacity
          onPress={onCheckSolution}
          disabled={
            isBusy ||
            !selectedCell ||
            sudoku.defaultScore == sudoku.userScore ||
            sudoku.userScore === boardSize * boardSize
          }
        >
          <MaterialCommunityIcons
            name={eyeIconName as any}
            size={cellDimension}
            color={
              sudoku.defaultScore === sudoku.userScore || isBusy
                ? theme.colors.inactive
                : sudoku.hasSolution
                ? theme.colors.success
                : theme.colors.fail
            }
          />
        </TouchableOpacity>
        <View style={{ width: cellDimension, height: cellDimension }}></View>
        <TouchableOpacity
          onPress={onCreate}
          disabled={
            isBusy ||
            !sudoku.hasSolution ||
            !selectedCell ||
            sudoku.defaultScore == sudoku.userScore ||
            sudoku.userScore === boardSize * boardSize
          }
        >
          <MaterialIcons
            name='library-add'
            size={cellDimension}
            color={
              isBusy ||
              !sudoku.hasSolution ||
              sudoku.defaultScore === sudoku.userScore
                ? theme.colors.inactive
                : theme.colors.primary
            }
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

type OwnProps = {
  boardDimension: number;
  isBusy: boolean;
  isPortrait: boolean;
  onCheckSolution: () => void;
};

const mapState = ({ newSudoku, theme }: RootState) => ({
  selectedCell: newSudoku.selectedCell,
  sudoku: newSudoku,
  theme,
});

const mapDispatch = (dispatch: AppDispatch) => ({
  dispatch,
});

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = OwnProps & PropsFromRedux;

export default connect(mapState)(NewGameController);

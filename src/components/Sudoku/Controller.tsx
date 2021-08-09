import React, { useCallback, useState } from 'react';
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
} from '../../storage/store';
import { NAVIGATION_HEADER_HEIGHT, NAVIGATION_TAB_HEIGHT } from '../../styles';
import {
  getAvailableCells,
  getCellSize,
  EMPTY_BOARDS,
  SUDOKU_EMPTY_CELL,
  DEBOUNCE_WAIT,
} from '../../sudoku';

import useDebounceDimensions from '../../hooks/useDebounceDimensions';
import ControllerCell from './ControllerCell';

const Controller: React.FC<Props> = ({
  id,
  userId,
  boardDimension,
  cellSize,
  isPortrait,
  options,
  showHints,
  selectedCell,
  sudoku,
  theme,
  dispatch,
}) => {
  if (sudoku) {
    const [reveal, setReveal] = useState(false);

    // Icon names
    let eyeIconName = reveal ? 'eye' : 'eye-off';
    if (!(sudoku.hasSolution && options.showReveal))
      eyeIconName = 'eye-outline';
    let hintsIconName = showHints ? 'lightbulb' : 'lightbulb-off';
    if (!options.showHints) hintsIconName = 'lightbulb-off-outline';

    const { col, row } = selectedCell;
    const { board } = sudoku;
    const boardSize = board.length;
    const rootSize = Math.sqrt(boardSize);

    // Get cell dimensions if not provided
    if (!cellSize || isPortrait === undefined) {
      if (!boardDimension) {
        const headerHeight = NAVIGATION_HEADER_HEIGHT;
        const tabBarHeight = NAVIGATION_TAB_HEIGHT;

        const { dimensions, isPortrait: dIsPortrait } =
          useDebounceDimensions(DEBOUNCE_WAIT);
        isPortrait = dIsPortrait;

        let effectiveHeight = dimensions.height - tabBarHeight - headerHeight;
        let effectiveWidth = dimensions.width;
        boardDimension = Math.min(effectiveHeight, effectiveWidth);
      }

      cellSize = Math.floor(getCellSize(boardDimension, boardSize));
    }

    // Set screenStyles theme based on screen type
    const screenStyles = isPortrait ? theme.portrait : theme.landscape;

    // Check if current selected col and row is valid
    const isValidIndices =
      col > -1 && col < boardSize && row > -1 && row < boardSize;

    // Get the selected cell value
    let selectedValue = 0;
    if (isValidIndices) {
      selectedValue = sudoku.board[selectedCell.row][selectedCell.col].value;
    }

    // Produce control cells list and mark cells that have unique value
    // within col, row, and subgrid
    const emptyRows = EMPTY_BOARDS[boardSize][0];
    let unique = new Set<number>();
    if (isValidIndices) {
      unique = getAvailableCells(col, row, board);
    }

    const onCellPress = (value: number) => {
      if (isValidIndices && userId) {
        const cellValue = board[row][col].value;
        if (cellValue !== value) {
          dispatch(
            updateSudokuGameValueAsync({
              userId,
              sudokuId: sudoku.id,
              col,
              row,
              value,
            })
          );
        }
      }
    };

    const onCellClear = () => {
      if (isValidIndices && userId) {
        const cellValue = board[row][col].value;
        if (cellValue !== SUDOKU_EMPTY_CELL) {
          dispatch(
            updateSudokuGameValueAsync({
              userId,
              sudokuId: sudoku.id,
              col,
              row,
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

    return (
      <View style={screenStyles.controllContainer}>
        <View
          style={
            isValidIndices
              ? screenStyles.controlCellsContainer
              : screenStyles.controlCellsContainerHide
          }
        >
          {emptyRows.map((controlValue, index) => {
            // Calculate subgrid margins
            const isSubgrid = index !== boardSize - 1 && index % rootSize == 2;

            let cstyle = isPortrait
              ? screenStyles.cellNormTopBottomRight
              : screenStyles.cellNormLeftRightBottom;

            if (isPortrait) {
              if (index === 0) cstyle = screenStyles.cellNormBox;
              else if (isSubgrid)
                cstyle = screenStyles.cellNormTopBottomSubRight;
            } else {
              if (index === 0) cstyle = screenStyles.cellNormBox;
              else if (isSubgrid)
                cstyle = screenStyles.cellNormLeftRightSubBottom;
            }

            return (
              <ControllerCell
                key={index}
                id={id}
                userId={userId}
                col={col}
                row={row}
                value={controlValue + 1}
                cellSize={cellSize ? cellSize : 30}
                isPressable={isValidIndices && unique.has(controlValue + 1)}
                isReveal={reveal}
                style={cstyle}
                onPress={() => onCellPress(controlValue + 1)}
              />
            );
          })}
        </View>
        <View
          style={isPortrait ? { height: cellSize } : { width: cellSize }}
        ></View>
        <View
          style={
            !isValidIndices
              ? screenStyles.controlBtnContainerHide
              : screenStyles.controlBtnContainer
          }
        >
          <TouchableOpacity
            onPress={onCellClear}
            disabled={!isValidIndices || selectedValue === SUDOKU_EMPTY_CELL}
          >
            <AntDesign
              name='closesquareo'
              size={cellSize * 1.2}
              color={
                isValidIndices && selectedValue !== SUDOKU_EMPTY_CELL
                  ? theme.colors.remove
                  : theme.colors.inactive
              }
            />
          </TouchableOpacity>
          <View style={{ width: cellSize, height: cellSize }}></View>

          <TouchableOpacity
            onPress={onReset}
            disabled={
              !isValidIndices || sudoku.defaultScore == sudoku.userScore
            }
          >
            <MaterialCommunityIcons
              name='restart'
              size={cellSize * 1.2}
              color={
                sudoku.defaultScore === sudoku.userScore
                  ? theme.colors.inactive
                  : theme.colors.reset
              }
            />
          </TouchableOpacity>
          <View style={{ width: cellSize, height: cellSize }}></View>
          <Pressable
            onPressIn={() => setReveal(true)}
            onPressOut={() => setReveal(false)}
            disabled={
              !isValidIndices || !(sudoku.hasSolution && options.showReveal)
            }
          >
            <Ionicons
              name={eyeIconName as any}
              size={cellSize * 1.2}
              color={
                sudoku.hasSolution && reveal && options.showReveal
                  ? theme.colors.reveal
                  : theme.colors.inactive
              }
            />
          </Pressable>
          <View style={{ width: cellSize, height: cellSize }}></View>
          <TouchableOpacity
            onPress={toggleShowHints}
            disabled={!isValidIndices || !(options.showHints || showHints)}
          >
            <MaterialCommunityIcons
              name={hintsIconName as any}
              size={cellSize * 1.2}
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
  } else {
    return <></>;
  }
};

interface OwnProps {
  id: string;
  userId: string;
  boardDimension?: number;
  cellSize?: number;
  isPortrait: boolean;
}

interface OwnProps {
  id: string;
  userId: string;
  boardDimension?: number;
  cellSize?: number;
  isPortrait: boolean;
}

const mapState = (
  { options, theme, users }: RootState,
  { id, userId }: OwnProps
) => {
  const selectedCell = users[userId]?.sudokus[id]?.selectedCell ?? {
    col: -1,
    row: -1,
    value: -1,
  };
  const sudoku =
    userId && userId in users ? users[userId].sudokus[id] : undefined;

  return {
    id,
    options,
    showHints: sudoku ? sudoku.showHints : false,
    selectedCell,
    sudoku,
    theme,
    userId,
  };
};

const mapDispatch = (dispatch: AppDispatch) => ({
  dispatch,
});

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = OwnProps & PropsFromRedux;

export default connect(mapState)(Controller);

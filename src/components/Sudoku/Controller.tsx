import React, { useCallback, useEffect, useState } from 'react';
import { Dimensions, Pressable, TouchableOpacity, View } from 'react-native';
import Consants from 'expo-constants';
import {
  AntDesign,
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import { debounce } from 'lodash';
import { connect, ConnectedProps } from 'react-redux';
import {
  AppDispatch,
  resetSudokuGameFromUserAsync,
  RootState,
  updateShowHintsForGame,
  updateSudokuGameValueAsync,
} from '../../storage/store';
import {
  getAvailableCells,
  getCellSize,
  EMPTY_BOARDS,
  SUDOKU_EMPTY_CELL,
  DEBOUNCE_WAIT,
} from '../../sudoku';
import {
  NAVIGATION_HEADER_HEIGHT,
  SUDOKU_CELL_NORMAL_MARGIN,
} from '../../styles';
import { CellEntity } from '../../types';
import ControllerCell from './ControllerCell';

function Controller({
  id,
  selectedCell,
  appShowHints,
  showHints,
  boardDimension,
  cellSize,
  sudoku,
  userId,
  theme,
  dispatch,
}: Props) {
  if (sudoku) {
    // Get screen orientation
    const screen = Dimensions.get('window');
    const isPortrait = screen.width <= screen.height;

    // Set screenStyles theme based on screen type
    const screenStyles = isPortrait ? theme.portrait : theme.landscape;

    const [reveal, setReveal] = useState(false);
    const [dimensions, setDimensions] = React.useState({
      height: Dimensions.get('window').height,
      width: Dimensions.get('window').width,
    });

    // Listens for window size changes
    useEffect(() => {
      const debouncedHandleResize = debounce(function handleResize() {
        const { height, width } = Dimensions.get('window');
        setDimensions({
          height: height,
          width: width,
        });
      }, DEBOUNCE_WAIT);
      Dimensions.addEventListener('change', debouncedHandleResize);

      return () => {
        debouncedHandleResize.cancel();
        Dimensions.removeEventListener('change', debouncedHandleResize);
      };
    }, []);

    // Icon names
    let eyeIconName = reveal ? 'eye' : 'eye-off';
    if (!sudoku?.hasSolution) eyeIconName = 'eye-outline';
    let hintsIconName = showHints ? 'lightbulb' : 'lightbulb-off';
    if (!appShowHints) hintsIconName = 'lightbulb-off-outline';

    const { col, row } = selectedCell;
    const { board } = sudoku;
    const boardSize = board.length;

    // Get cell dimensions if not provided
    const rootSize = Math.sqrt(boardSize);
    if (!cellSize) {
      let effectiveHeight =
        dimensions.height - Consants.statusBarHeight - NAVIGATION_HEADER_HEIGHT;
      let effectiveWidth = dimensions.width;
      let dimension = Math.min(effectiveHeight, effectiveWidth);
      if (boardDimension) dimension = boardDimension;

      cellSize = Math.floor(
        getCellSize(dimension, boardSize, SUDOKU_CELL_NORMAL_MARGIN)
      );
    }

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

    const onCellPress = useCallback(
      (value: number) => {
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
      },
      [selectedCell]
    );

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
        updateShowHintsForGame({
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
            // Calculate subgrid seperation magins
            const isSeperation =
              index !== boardSize - 1 && index % rootSize == 2;

            let cstyle = isPortrait
              ? screenStyles.cellNormTopBottomRight
              : screenStyles.cellNormLeftRightBottom;

            if (isPortrait) {
              if (index === 0) cstyle = screenStyles.cellNormBox;
              else if (isSeperation)
                cstyle = screenStyles.cellNormTopBottomSepRight;
            } else {
              if (index === 0) cstyle = screenStyles.cellNormBox;
              else if (isSeperation)
                cstyle = screenStyles.cellNormLeftRightSepBottom;
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
            disabled={!isValidIndices || !sudoku.hasSolution}
          >
            <Ionicons
              name={eyeIconName as any}
              size={cellSize * 1.2}
              color={
                sudoku.hasSolution && reveal
                  ? theme.colors.reveal
                  : theme.colors.inactive
              }
            />
          </Pressable>
          <View style={{ width: cellSize, height: cellSize }}></View>
          <TouchableOpacity
            onPress={toggleShowHints}
            disabled={!isValidIndices || !appShowHints}
          >
            <MaterialCommunityIcons
              name={hintsIconName as any}
              size={cellSize * 1.2}
              color={
                appShowHints && showHints
                  ? theme.colors.showHints
                  : theme.colors.inactive
              }
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  } else {
    return <View></View>;
  }
}

interface OwnProps {
  id: string;
  userId: string | null;
  boardDimension?: number;
  cellSize?: number;
}

const mapState = (
  { options, theme, users }: RootState,
  { id, userId }: OwnProps
) => {
  let selectedCell: CellEntity = { col: -1, row: -1, value: -1 };
  let sudoku = null;

  if (id && userId && userId in users && id in users[userId].sudokus) {
    selectedCell = users[userId].sudokus[id].selectedCell;
    sudoku = users[userId].sudokus[id];
  }

  return {
    id,
    appShowHints: options.showHints,
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

import React, { useCallback, useEffect, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Platform, View } from 'react-native';

import { RouteProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { TabsParamList } from '../../Navigators/Tabs';

import {
  AppDispatch,
  RootState,
  setNewSudokuHasSolution,
  setStatusBarVisible,
} from '../../../storage/store';
import {
  DEBOUNCE_WAIT,
  EMPTY_BOARDS,
  getRawDataFromSudokuGame,
} from '../../../sudoku';
import {
  BOARD_PADDING,
  GAP_BETWEEN_COMPONENTS,
  INFO_FONT_SIZE,
  NAVIGATION_TAB_HEIGHT,
  SUDOKU_CELL_NORMAL_MARGIN,
} from '../../../styles';
import { sleep } from '../../../utils';

import useDebounceDimensions from '../../../hooks/useDebounceDimensions';
import Grid, { GridItemProps } from '../Grid';
import NewGameCell from './NewGameCell';
import NewGameController from './NewGameController';
import NewGameInfo from './NewGameInfo';
import SudokuSolver from '../../../sudoku/sudoku-solver';

const NewGame: React.FC<Props> = ({
  boardSize,
  newSudoku,
  statusBarVisible,
  theme,
  navigation,
  dispatch,
}) => {
  const [infoMsg, setInfoMsg] = useState('');
  const [isSolving, setIsSolving] = useState(false);

  const dimensions = useDebounceDimensions(
    Platform.OS === 'ios' || Platform.OS === 'android' ? 0 : DEBOUNCE_WAIT
  );

  // Landscape: hide status bar and header to increase visual area
  // Portrait: show status bar and header
  useEffect(() => {
    if (dimensions.isPortrait) {
      navigation.setOptions({
        headerShown: true,
        tabBarStyle: {
          height: NAVIGATION_TAB_HEIGHT,
          opacity: 100,
        },
      });
      dispatch(setStatusBarVisible(true));
    } else {
      navigation.setOptions({
        headerShown: false,
        tabBarStyle: {
          height: 0,
          opacity: 0,
        },
      });
      dispatch(setStatusBarVisible(false));
    }
  }, [dimensions.isPortrait, statusBarVisible]);

  // Set screenStyles theme based on screen type
  const screenStyles = dimensions.isPortrait ? theme.portrait : theme.landscape;

  // Get initial cell dimensions based on height
  let boardDimension = dimensions.isPortrait
    ? dimensions.height
    : dimensions.width;

  // Resize again to account for Info & Controller component extra space
  const extraSpace =
    (boardDimension / boardSize) * 3 +
    SUDOKU_CELL_NORMAL_MARGIN * 2 +
    GAP_BETWEEN_COMPONENTS * 4 +
    INFO_FONT_SIZE;
  let effectiveHeight;
  let effectiveWidth;

  if (dimensions.isPortrait) {
    // Effective dimension is based on height for portrait
    effectiveHeight = dimensions.height - extraSpace;
    effectiveWidth = dimensions.width;
  } else {
    // Effective dimension is based on width for landscape
    // Header is turned off in landscape
    effectiveHeight = dimensions.height;
    effectiveWidth = dimensions.width - extraSpace;
  }
  boardDimension = Math.min(effectiveWidth, effectiveHeight);

  // Apply some padding
  boardDimension -= BOARD_PADDING * 2;

  const cellDimension = boardDimension / boardSize;

  const gridData = EMPTY_BOARDS[boardSize];

  // Check if the new sudoku game is solvable
  const onCheckSolution = async () => {
    setInfoMsg('Check if solvable...');
    await sleep(1000);
    setInfoMsg('');
    setIsSolving(true);

    // Wait 500 ms to allow for other UI to finish rednering
    // Otherwise the SudokuSolver will block the event loop
    await sleep(500);

    // Solving starts
    const rawData = getRawDataFromSudokuGame(newSudoku);
    const sudokuSolver = new SudokuSolver(rawData);
    const isSolved = sudokuSolver.solve();
    // Solving ends

    // Update info
    setIsSolving(false);
    if (isSolved) dispatch(setNewSudokuHasSolution(true));
    setInfoMsg(isSolved ? 'Is solvable' : 'Not solvable');

    // Clear message after 3 seconds
    await sleep(3000);
    setInfoMsg('');
  };

  const onGoBack = useCallback(() => {
    navigation.goBack();
    dispatch(setStatusBarVisible(true));
  }, [navigation]);

  const renderGridItem: React.FC<GridItemProps<number>> = useCallback(
    ({ row, col }) => (
      <NewGameCell col={col} row={row} dimension={cellDimension} />
    ),
    [boardDimension]
  );

  return (
    <View style={screenStyles.sudokuContainer}>
      <View
        style={[
          screenStyles.sudokuContainerForInfo,
          dimensions.isLandscape && { height: boardDimension },
        ]}
      >
        <NewGameInfo
          cellDimension={cellDimension}
          boardSize={boardSize}
          isBusy={isSolving}
          isPortrait={dimensions.isPortrait}
          message={infoMsg}
          onGoBack={onGoBack}
        />
      </View>
      <View style={screenStyles.sudokuContainerForGrid}>
        <Grid
          id={'NewGame'}
          colDimension={boardDimension}
          rowDimension={boardDimension}
          data={gridData}
          isPortrait={true}
          renderItem={renderGridItem}
        />
      </View>
      <View style={screenStyles.sudokuContainerForController}>
        <NewGameController
          boardDimension={boardDimension}
          isBusy={isSolving}
          isPortrait={dimensions.isPortrait}
          onCheckSolution={onCheckSolution}
        />
      </View>
    </View>
  );
};

type NewGameNavigationProp = BottomTabNavigationProp<TabsParamList, 'NewGame'>;
type NewGameRouteProp = RouteProp<TabsParamList, 'NewGame'>;

type OwnProps = {
  id: string;
  isPortrait: boolean;
  navigation: NewGameNavigationProp;
  route: NewGameRouteProp;
};

const mapState = ({ newSudoku, status, theme }: RootState, {}: OwnProps) => {
  return {
    boardSize: newSudoku.board.length,
    newSudoku,
    selectedCell: newSudoku.selectedCell,
    statusBarVisible: status.statusBarVisible,
    theme,
  };
};

const mapDispatch = (dispatch: AppDispatch) => ({
  dispatch,
});

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = OwnProps & PropsFromRedux;

export default connect(mapState)(NewGame);

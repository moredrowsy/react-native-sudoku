import React, { useCallback, useEffect } from 'react';
import { Platform, View } from 'react-native';
import { connect, ConnectedProps } from 'react-redux';

import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamsList } from '../../Navigators/RootStack';

import {
  AppDispatch,
  RootState,
  setStatusBarVisible,
} from '../../../storage/store';
import {
  BOARD_PADDING,
  GAP_BETWEEN_COMPONENTS,
  INFO_FONT_SIZE,
  SUDOKU_CELL_NORMAL_MARGIN,
} from '../../../styles';
import { DEBOUNCE_WAIT, EMPTY_BOARDS } from '../../../sudoku';

import useDebounceDimensions from '../../../hooks/useDebounceDimensions';
import GameController from './GameController';
import GameInfo from './GameInfo';
import Grid, { GridItemProps } from '../Grid';
import SudokuCell from '../SudokuCell';

const Game: React.FC<Props> = ({
  id,
  userId,
  hasGameForUser,
  boardSize,
  statusBarVisible,
  theme,
  navigation,
  dispatch,
}) => {
  if (hasGameForUser && userId) {
    const dimensions = useDebounceDimensions(
      Platform.OS === 'ios' || Platform.OS === 'android' ? 0 : DEBOUNCE_WAIT
    );

    // Landscape: hide status bar and header to increase visual area
    // Portrait: show status bar and header
    useEffect(() => {
      if (dimensions.isPortrait) {
        navigation.setOptions({
          headerShown: true,
        });
        dispatch(setStatusBarVisible(true));
      } else {
        navigation.setOptions({
          headerShown: false,
        });
        dispatch(setStatusBarVisible(false));
      }
    }, [dimensions.isPortrait, statusBarVisible]);

    // Set screenStyles theme based on screen type
    const screenStyles = dimensions.isPortrait
      ? theme.portrait
      : theme.landscape;

    // Get initial cell dimensions based on height
    let boardDimension = dimensions.isPortrait
      ? dimensions.height
      : dimensions.width;

    // Resize again to account for GameInfo & GameController component extra space
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

    const onGoBack = useCallback(() => {
      navigation.goBack();
      dispatch(setStatusBarVisible(true));
    }, [navigation]);

    const renderGridItem: React.FC<GridItemProps<number>> = useCallback(
      ({ id, item, row, col }) => (
        <SudokuCell
          id={id}
          userId={userId}
          col={col}
          row={row}
          dimension={cellDimension}
        />
      ),
      [userId, boardDimension]
    );

    return (
      <View style={screenStyles.sudokuContainer}>
        <View
          style={[
            screenStyles.sudokuContainerForInfo,
            dimensions.isLandscape && { height: boardDimension },
          ]}
        >
          <GameInfo
            id={id}
            userId={userId}
            cellDimension={cellDimension}
            boardSize={boardSize}
            isPortrait={dimensions.isPortrait}
            onGoBack={onGoBack}
          />
        </View>
        <View style={screenStyles.sudokuContainerForGrid}>
          <Grid
            id={id}
            colDimension={boardDimension}
            rowDimension={boardDimension}
            data={gridData}
            isPortrait={true}
            renderItem={renderGridItem}
          />
        </View>
        <View style={screenStyles.sudokuContainerForController}>
          <GameController
            id={id}
            userId={userId}
            boardDimension={boardDimension}
            isPortrait={dimensions.isPortrait}
          />
        </View>
      </View>
    );
  } else {
    return <></>;
  }
};

type GameNavigationProp = StackNavigationProp<RootStackParamsList, 'Game'>;
type GameRouteProp = RouteProp<RootStackParamsList, 'Game'>;

type OwnProps = {
  id: string;
  boardSize: number;
  isPortrait: boolean;
  navigation: GameNavigationProp;
  route: GameRouteProp;
};

const mapState = ({ status, theme, users }: RootState, { route }: OwnProps) => {
  const id = route.params.id;
  const { userId } = status;

  const hasGameForUser = userId && users[userId]?.sudokus[id] ? true : false;
  const boardSize = (userId && users[userId]?.sudokus[id]?.board?.length) || 9;

  return {
    id,
    userId,
    boardSize,
    hasGameForUser,
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

export default connect(mapState)(Game);

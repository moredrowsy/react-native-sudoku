import React, { useCallback, useEffect } from 'react';
import { View } from 'react-native';
import { connect, ConnectedProps } from 'react-redux';

import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamsList } from '../Navigators/RootStack';

import {
  AppDispatch,
  RootState,
  setStatusBarVisible,
} from '../../storage/store';
import {
  BOARD_PADDING,
  GAP_BETWEEN_COMPONENTS,
  SUDOKU_CELL_NORMAL_MARGIN,
} from '../../styles';

import useDebounceDimensions from '../../hooks/useDebounceDimensions';
import Board from './Board';
import Controller from './Controller';
import Info, { INFO_FONT_SIZE } from './Info';

const Sudoku: React.FC<Props> = ({
  id,
  userId,
  hasSudokuGameForUser,
  boardSize,
  theme,
  navigation,
  dispatch,
}) => {
  if (hasSudokuGameForUser && userId) {
    const dimensions = useDebounceDimensions();

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
    }, [dimensions.isPortrait]);

    // Set screenStyles theme based on screen type
    const screenStyles = dimensions.isPortrait
      ? theme.portrait
      : theme.landscape;

    // Get initial cell dimensions based on height
    let boardDimension = dimensions.isPortrait
      ? dimensions.height
      : Math.min(dimensions.height, dimensions.width);

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

    const onGoBack = useCallback(() => {
      navigation.goBack();
      dispatch(setStatusBarVisible(true));
    }, [navigation]);

    return (
      <View style={screenStyles.sudokuContainer}>
        <View
          style={[
            screenStyles.sudokuContainerForInfo,
            dimensions.isLandscape && { height: boardDimension },
          ]}
        >
          <Info
            id={id}
            userId={userId}
            boardDimension={boardDimension}
            isPortrait={dimensions.isPortrait}
            onGoBack={onGoBack}
          />
        </View>
        <View style={screenStyles.sudokuContainerForBoard}>
          <Board
            id={id}
            userId={userId}
            boardDimension={boardDimension}
            isPressable={true}
            isPortrait={dimensions.isPortrait}
            hideSelectedColor={false}
          />
        </View>
        <View style={screenStyles.sudokuContainerForController}>
          <Controller
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
type HomeScreenNavigationProp = StackNavigationProp<
  RootStackParamsList,
  'Sudoku'
>;
type HomeScreenRouteProp = RouteProp<RootStackParamsList, 'Sudoku'>;

interface OwnProps {
  id: string;
  boardSize: number;
  isPortrait: boolean;
  navigation: HomeScreenNavigationProp;
  route: HomeScreenRouteProp;
}

const mapState = ({ status, theme, users }: RootState, { route }: OwnProps) => {
  const id = route.params.id;
  const { userId } = status;

  const hasSudokuGameForUser =
    userId && users[userId]?.sudokus[id] ? true : false;
  const boardSize = (userId && users[userId]?.sudokus[id]?.board?.length) || 9;

  return {
    id,
    userId,
    boardSize,
    hasSudokuGameForUser,
    theme,
  };
};

const mapDispatch = (dispatch: AppDispatch) => ({
  dispatch,
});

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = OwnProps & PropsFromRedux;

export default connect(mapState)(Sudoku);

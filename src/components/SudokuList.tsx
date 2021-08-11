import React, { useCallback } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { connect, ConnectedProps } from 'react-redux';

import { CommonActions, RouteProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { TabsParamList } from './Navigators/Tabs';

import {
  addSudokuGameToUserAsync,
  AppDispatch,
  RootState,
} from '../storage/store';
import SudokuCell from './Sudoku/SudokuCell';
import {
  BOARD_PADDING,
  NAVIGATION_HEADER_HEIGHT,
  NAVIGATION_TAB_HEIGHT,
} from '../styles';
import { DEBOUNCE_WAIT, EMPTY_BOARDS } from '../sudoku';

import { SudokuGameEntity } from '../types';

import useDebounceDimensions from '../hooks/useDebounceDimensions';
import Board, { BoardItemProps } from './Sudoku/Board';

const SudokuList: React.FC<Props> = ({
  sudokus,
  userId,
  loading,
  theme,
  userSudokus,
  navigation,
  dispatch,
}) => {
  const sudokusForFlatList = sudokus ? Object.values(sudokus) : [];

  // Get dimensions and screen orientation for board
  const headerHeight = NAVIGATION_HEADER_HEIGHT;
  const tabBarHeight = NAVIGATION_TAB_HEIGHT;

  const dimensions = useDebounceDimensions(
    Platform.OS === 'ios' || Platform.OS === 'android' ? 0 : DEBOUNCE_WAIT
  );

  let effectiveHeight = dimensions.height - tabBarHeight - headerHeight;
  let effectiveWidth = dimensions.width;
  let boardDimension = Math.min(effectiveHeight, effectiveWidth);

  // Apply some padding
  if (dimensions.isPortrait) boardDimension -= BOARD_PADDING * 2;

  const onPressSudoku = useCallback(
    (id: string) => {
      if (userId && userSudokus && !(id in userSudokus)) {
        dispatch(addSudokuGameToUserAsync({ userId, sudoku: sudokus[id] }));
      }

      navigation.dispatch(
        CommonActions.navigate({
          name: 'Sudoku',
          params: {
            title: `Sudoku ${id}`,
            id,
          },
        })
      );
    },
    [navigation, userId, userSudokus, sudokus]
  );

  const renderBoardItem: React.FC<BoardItemProps<number>> = useCallback(
    ({ id, item, row, col }) => (
      <SudokuCell
        key={col}
        id={id}
        userId={userId}
        col={col}
        row={row}
        boardDimension={boardDimension}
        hideSelectedColor={true}
        isPressable={false}
      />
    ),
    [userId, boardDimension]
  );

  const renderSudokuGameItem: ListRenderItem<SudokuGameEntity> = ({
    item,
    index,
  }) => (
    <View
      style={
        index !== 0
          ? theme.portrait.flatListItem
          : theme.portrait.flatListFirstItem
      }
    >
      <TouchableOpacity onPress={() => onPressSudoku(item.id)}>
        <Board
          id={item.id}
          boardDimension={boardDimension}
          isPortrait={true}
          data={EMPTY_BOARDS[item.board.length]}
          renderItem={renderBoardItem}
        />
      </TouchableOpacity>
    </View>
  );

  if (!loading)
    return (
      <View style={styles.container}>
        {sudokusForFlatList.length > 0 ? (
          <FlatList
            data={sudokusForFlatList}
            keyExtractor={(item) => item.id}
            renderItem={renderSudokuGameItem}
            style={styles.flatList}
          />
        ) : (
          <View>
            <Text>No games</Text>
          </View>
        )}
      </View>
    );
  else {
    return (
      <View style={styles.container}>
        <ActivityIndicator size='large' color={theme.colors.primary} />
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flatList: {
    alignSelf: 'stretch',
  },
});

type HomeScreenNavigationProp = BottomTabNavigationProp<
  TabsParamList,
  'SudokuList'
>;
type HomeScreenRouteProp = RouteProp<TabsParamList, 'SudokuList'>;

type OwnProps = {
  navigation: HomeScreenNavigationProp;
  route: HomeScreenRouteProp;
};

const mapState = ({ status, sudokus, theme, users }: RootState) => ({
  loading: status.loading,
  sudokus,
  theme,
  userId: status.userId || undefined,
  userSudokus: status.userId ? users[status.userId]?.sudokus : undefined,
});

const mapDispatch = (dispatch: AppDispatch) => ({
  dispatch,
});

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = OwnProps & PropsFromRedux;

export default connect(mapState)(SudokuList);

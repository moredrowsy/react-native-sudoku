import React, { useCallback } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
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

import { SudokuGameEntity } from '../types';

import Board from './Sudoku/Board';

const FLAT_LIST_MARGIN_SIZE = 30;

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

  const renderSudokuGameItem: ListRenderItem<SudokuGameEntity> = ({
    item,
    index,
  }) => {
    return (
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
            userId={userId}
            isPressable={false}
            hideSelectedColor={true}
          />
        </TouchableOpacity>
      </View>
    );
  };

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
  userId: status.userId,
  userSudokus: status.userId ? users[status.userId]?.sudokus : undefined,
});

const mapDispatch = (dispatch: AppDispatch) => ({
  dispatch,
});

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = OwnProps & PropsFromRedux;

export default connect(mapState)(SudokuList);

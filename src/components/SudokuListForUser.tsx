import React from 'react';
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

import { AppDispatch, RootState } from '../storage/store';

import { SudokuGameEntity } from '../types';

import Board from './Sudoku/Board';

const FLAT_LIST_MARGIN_SIZE = 30;

function SudokuListForUser({
  loading,
  theme,
  userId,
  userSudokus,
  navigation,
  dispatch,
}: Props) {
  const sudokusForFlatList = userSudokus ? Object.values(userSudokus) : [];

  const onPressSudoku = (id: string) => {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'Sudoku',
        params: {
          title: `Sudoku ${id}`,
          id,
        },
      })
    );
  };

  const renderSudokuGameItem: ListRenderItem<SudokuGameEntity> = ({
    item,
    index,
  }) => (
    <View style={[styles.flatListItem, index == 0 && styles.flatListFirstItem]}>
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

  if (!loading) {
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
            <Text>You haven't started any games</Text>
          </View>
        )}
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <ActivityIndicator size='large' color={theme.colors.primary} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flatList: {
    alignSelf: 'stretch',
  },
  flatListItem: { alignSelf: 'center', marginBottom: FLAT_LIST_MARGIN_SIZE },
  flatListFirstItem: {
    alignSelf: 'center',
    marginTop: FLAT_LIST_MARGIN_SIZE,
    marginBottom: FLAT_LIST_MARGIN_SIZE,
  },
});

type HomeScreenNavigationProp = BottomTabNavigationProp<
  TabsParamList,
  'SudokuListForUser'
>;
type HomeScreenRouteProp = RouteProp<TabsParamList, 'SudokuListForUser'>;

type OwnProps = {
  navigation: HomeScreenNavigationProp;
  route: HomeScreenRouteProp;
};

const mapState = ({ status, theme, users }: RootState) => ({
  loading: status.loading,
  theme,
  userId: status.userId,
  userSudokus:
    status.userId && status.userId in users
      ? users[status.userId].sudokus
      : null,
});

const mapDispatch = (dispatch: AppDispatch) => ({
  dispatch,
});

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = OwnProps & PropsFromRedux;

export default connect(mapState)(SudokuListForUser);

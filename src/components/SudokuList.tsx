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
import { CommonActions } from '@react-navigation/native';

// Redux
import { connect, ConnectedProps } from 'react-redux';
import {
  addSudokuGameToUserAsync,
  AppDispatch,
  RootState,
} from '../storage/store';

import { SudokuGameEntity } from '../types';
import Board from './Sudoku/Board';
import { blue } from '../styles';

const FLAT_LIST_MARGIN_SIZE = 30;

function SudokuList({
  sudokus,
  userId,
  loading,
  userSudokus,
  navigation,
  dispatch,
}: Props) {
  const sudokusForFlatList = sudokus ? Object.values(sudokus) : [];

  const onPressSudoku = (id: string) => {
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
        <ActivityIndicator size='large' color={blue} />
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

interface OwnProps {
  navigation: any;
}

const mapState = ({ status, sudokus, users }: RootState) => ({
  loading: status.loading,
  sudokus,
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

export default connect(mapState)(SudokuList);

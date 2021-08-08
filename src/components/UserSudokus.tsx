import React, { useLayoutEffect, useState } from 'react';
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
  AppDispatch,
  removeSudokuGamesFromUserAsync,
  RootState,
} from '../storage/store';

import { SudokuGameEntity } from '../types';

import Board from './Sudoku/Board';
import LongPressHeader from './UserSudokusHeader';

const UserSudokus: React.FC<Props> = ({
  loading,
  theme,
  userId,
  userSudokus,
  navigation,
  dispatch,
}) => {
  if (!loading && userId) {
    const sudokusForFlatList = userSudokus ? Object.values(userSudokus) : [];
    const [isLongPressed, setIsLongPressed] = useState(false);
    const [toRemoveSet, setToRemoveSet] = useState(new Set<string>());

    useLayoutEffect(() => {
      if (isLongPressed && sudokusForFlatList.length > 0) {
        navigation.setOptions({
          headerTitle: '',
          headerShown: true,
          headerRightContainerStyle: {
            paddingRight: 10,
          },
          headerRight: () => (
            <LongPressHeader
              onCancel={() => setIsLongPressed(false)}
              onRemove={toRemoveSet.size > 0 ? onRemoveUserSudokus : undefined}
            />
          ),
        });
      } else {
        navigation.setOptions({
          headerTitle: '',
          headerShown: false,
          headerRightContainerStyle: {
            paddingRight: 10,
          },
          headerRight: () => <></>,
        });
        setIsLongPressed(false);
      }
    }, [navigation, isLongPressed, sudokusForFlatList]);

    const onPressSudoku = (id: string) => {
      if (isLongPressed) {
        if (toRemoveSet.has(id)) {
          setToRemoveSet((prevSet) => {
            prevSet.delete(id);
            return new Set([...prevSet]);
          });
        } else {
          setToRemoveSet(new Set([...toRemoveSet, id]));
        }
      } else {
        navigation.dispatch(
          CommonActions.navigate({
            name: 'Sudoku',
            params: {
              title: `Sudoku ${id}`,
              id,
            },
          })
        );
      }
    };

    const onLongPressSudoku = (id: string) => {
      if (!isLongPressed) {
        setToRemoveSet(new Set([id]));
      } else {
        // CLear toRemoveSet when exiting isLongPressed
        if (toRemoveSet.size > 0) setToRemoveSet(new Set());
      }
      setIsLongPressed((p) => !p);
    };

    const onRemoveUserSudokus = () => {
      dispatch(
        removeSudokuGamesFromUserAsync({ userId, sudokuIds: toRemoveSet })
      );
      setToRemoveSet(new Set());
    };

    const renderSudokuGameItem: ListRenderItem<SudokuGameEntity> = ({
      item,
      index,
    }) => {
      let itemStyle;
      if (index !== 0) {
        itemStyle = toRemoveSet.has(item.id)
          ? theme.portrait.flatListItemSelected
          : theme.portrait.flatListItem;
      } else {
        itemStyle = toRemoveSet.has(item.id)
          ? theme.portrait.flatListFirstItemSelected
          : theme.portrait.flatListFirstItem;
      }

      return (
        <View style={itemStyle}>
          <TouchableOpacity
            onPress={() => onPressSudoku(item.id)}
            onLongPress={() => onLongPressSudoku(item.id)}
          >
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
  'UserSudokus'
>;
type HomeScreenRouteProp = RouteProp<TabsParamList, 'UserSudokus'>;

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

export default connect(mapState)(UserSudokus);

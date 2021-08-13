import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
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
  AppDispatch,
  removeSudokuGamesFromUserAsync,
  RootState,
} from '../storage/store';
import {
  BOARD_PADDING,
  NAVIGATION_HEADER_HEIGHT,
  NAVIGATION_TAB_HEIGHT,
} from '../styles';
import { DEBOUNCE_WAIT, EMPTY_BOARDS } from '../sudoku';
import { SudokuGameEntity } from '../types';
import { ellipseStr } from '../utils';

import useDebounceDimensions from '../hooks/useDebounceDimensions';
import Grid, { GridItemProps } from './Sudoku/Grid';
import LongPressHeader from './UserSudokusHeader';
import SudokuCell from './Sudoku/SudokuCell';

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

    // Reset screen when screen is swipe back
    useEffect(() => {
      navigation.addListener('blur', onGobackEvent);

      return () => {
        navigation.removeListener('blur', onGobackEvent);
      };
    }, [navigation]);

    // Show/hide screen header whenever it is long presssed or has set items
    useLayoutEffect(() => {
      // Show header when long pressed and exist items in toRemove set
      if (isLongPressed && sudokusForFlatList.length > 0) {
        showNavigationHeader();
      } else if (sudokusForFlatList.length == 0) {
        setIsLongPressed(false);
        hideNavigationHeader();
      } else {
        hideNavigationHeader();
      }
    }, [navigation, isLongPressed, sudokusForFlatList]);

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

    const hideNavigationHeader = () => {
      navigation.setOptions({
        headerTitle: '',
        headerShown: false,
        headerRightContainerStyle: {
          paddingRight: 10,
        },
        headerRight: () => <></>,
      });
    };

    const showNavigationHeader = () => {
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
    };

    // Reset screen header, selection, etc when going back to another screen
    const onGobackEvent = () => {
      setIsLongPressed(false);
      setToRemoveSet(new Set());
    };

    const onPressSudoku = (id: string) => {
      if (isLongPressed) {
        // Deselect by removing id from set
        if (toRemoveSet.has(id)) {
          setToRemoveSet((prevSet) => {
            prevSet.delete(id);
            return new Set([...prevSet]);
          });
        }
        // Select by add id to set
        else {
          setToRemoveSet(new Set([...toRemoveSet, id]));
        }
      } else {
        navigation.dispatch(
          CommonActions.navigate({
            name: 'Game',
            params: {
              title: `Sudoku ${ellipseStr(id, 15)}`,
              id,
            },
          })
        );
      }
    };

    const onLongPressSudoku = (id: string) => {
      // Long press in
      if (!isLongPressed) {
        setToRemoveSet(new Set([id]));
      }
      // Long press out
      else {
        // CLear toRemoveSet when exiting isLongPressed
        if (toRemoveSet.size > 0) setToRemoveSet(new Set());
      }
      setIsLongPressed(!isLongPressed);
    };

    const onRemoveUserSudokus = () => {
      dispatch(
        removeSudokuGamesFromUserAsync({ userId, sudokuIds: toRemoveSet })
      );
      setToRemoveSet(new Set());
    };

    const renderGridItem: React.FC<GridItemProps<number>> = useCallback(
      ({ id, col, row, rowCellDimension }) => (
        <SudokuCell
          id={id}
          userId={userId}
          col={col}
          row={row}
          dimension={rowCellDimension}
          hideSelectedColor={true}
          isPressable={false}
        />
      ),
      [userId, boardDimension]
    );

    const renderSudokuGameItem: ListRenderItem<SudokuGameEntity> = ({
      item,
      index,
    }) => {
      let itemStyle;
      if (index !== 0) {
        itemStyle =
          toRemoveSet.has(item.id) && isLongPressed
            ? theme.portrait.flatListItemSelected
            : theme.portrait.flatListItem;
      } else {
        itemStyle =
          toRemoveSet.has(item.id) && isLongPressed
            ? theme.portrait.flatListFirstItemSelected
            : theme.portrait.flatListFirstItem;
      }

      return (
        <View style={itemStyle}>
          <TouchableOpacity
            onPress={() => onPressSudoku(item.id)}
            onLongPress={() => onLongPressSudoku(item.id)}
          >
            <Grid
              id={item.id}
              colDimension={boardDimension}
              rowDimension={boardDimension}
              data={EMPTY_BOARDS[item.board.length]}
              isPortrait={true}
              renderItem={renderGridItem}
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

type UserSudokuNavigationProp = BottomTabNavigationProp<
  TabsParamList,
  'UserSudokus'
>;
type UserSudokuRouteProp = RouteProp<TabsParamList, 'UserSudokus'>;

type OwnProps = {
  navigation: UserSudokuNavigationProp;
  route: UserSudokuRouteProp;
};

const mapState = ({ status, theme, users }: RootState) => ({
  loading: status.loading,
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

export default connect(mapState)(UserSudokus);

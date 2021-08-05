import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

// Redux
import { connect, ConnectedProps } from 'react-redux';
import {
  AppDispatch,
  RootState,
  initSudokuGameDataAsync,
  initSudokuUserAsync,
  initAppOptionsAsync,
} from '../storage/store';

// Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import AppOptions from './AppOptions';
import StatusBar from './StatusBar';
import Sudoku from './Sudoku';
import SudokuList from './SudokuList';
import { blue, gray, white } from '../styles';
import SudokuListForUser from './SudokuListForUser';

type StackParamList = {
  TabsNavigator: { name: string };
  Sudoku: { name: string; title: string; id: string };
};

const Stack = createStackNavigator<StackParamList>();
const Tabs = createBottomTabNavigator();

const TabsNavigator = () => (
  <Tabs.Navigator
    screenOptions={{
      tabBarActiveTintColor: blue,
      tabBarInactiveTintColor: gray,
      headerShown: false,
      tabBarLabelStyle: [{ fontSize: 14, fontWeight: 'bold' }],
    }}
  >
    <Tabs.Screen
      name='SudokuList'
      component={SudokuList}
      options={{
        title: 'Sudoku List',
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons
            name='view-dashboard'
            color={color}
            size={30}
          />
        ),
      }}
    ></Tabs.Screen>
    <Tabs.Screen
      name='SudokuListForUser'
      component={SudokuListForUser}
      options={{
        title: 'My List',
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons
            name='view-dashboard-outline'
            color={color}
            size={30}
          />
        ),
      }}
    ></Tabs.Screen>
    <Tabs.Screen
      name='AppOptions'
      component={AppOptions}
      options={{
        title: 'Options',
        tabBarIcon: ({ color }) => (
          <Ionicons name='options' color={color} size={30} />
        ),
      }}
    ></Tabs.Screen>
  </Tabs.Navigator>
);

const StackNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerTitleAlign: 'center',
      headerTintColor: white,
      headerStyle: {
        backgroundColor: blue,
      },
    }}
  >
    <Stack.Screen
      name='TabsNavigator'
      component={TabsNavigator}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name='Sudoku'
      component={Sudoku}
      // TODO: fix route type
      options={({ route }) => ({
        title: route?.params?.title,
        headerShown: true,
      })}
    />
  </Stack.Navigator>
);

function App({ dispatch, status }: Props) {
  useEffect(() => {
    dispatch(initSudokuUserAsync());
    dispatch(initSudokuGameDataAsync());
    dispatch(initAppOptionsAsync());
  }, []);

  return (
    <View style={styles.container}>
      <View>
        <StatusBar backgroundColor={blue} />
      </View>
      <NavigationContainer>
        <StackNavigator />
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

interface OwnProps {}

const mapState = ({ status }: RootState) => ({
  status,
});

const mapDispatch = (dispatch: AppDispatch) => ({
  dispatch,
});

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = OwnProps & PropsFromRedux;

export default connect(mapState)(App);

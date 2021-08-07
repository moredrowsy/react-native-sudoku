import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Theme } from '../styles';
import SudokuList from './SudokuList';
import SudokuListForUser from './SudokuListForUser';
import AppOptions from './AppOptions';

const Tabs = createBottomTabNavigator();

function TabsNavigator({ extraData }: any) {
  const { theme }: { theme: Theme } = extraData;

  return (
    <Tabs.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.cellSelectedBackground,
        tabBarInactiveTintColor: theme.colors.inactive,
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
}

export default TabsNavigator;

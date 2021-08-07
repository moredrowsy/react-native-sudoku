import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamsList } from './RootStack';

import { AppDispatch, RootState } from '../../storage/store';

import AppOptions from '../AppOptions';
import SudokuList from '../SudokuList';
import SudokuListForUser from '../SudokuListForUser';

const Tab = createBottomTabNavigator<TabsParamList>();

function Tabs({ theme }: Props) {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.inactive,
        headerShown: false,
        tabBarLabelStyle: [{ fontSize: 14, fontWeight: 'bold' }],
      }}
    >
      <Tab.Screen
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
      />
      <Tab.Screen
        name='SudokuListForUser'
        component={SudokuListForUser}
        options={{
          title: 'My Sudoku',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name='view-dashboard-outline'
              color={color}
              size={30}
            />
          ),
        }}
      />
      <Tab.Screen
        name='AppOptions'
        component={AppOptions}
        options={{
          title: 'Options',
          tabBarIcon: ({ color }) => (
            <Ionicons name='options' color={color} size={30} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export type TabsParamList = {
  SudokuList: { title: string };
  SudokuListForUser: { title: string };
  AppOptions: { title: string };
};

type TabsScreenNavigationProp = StackNavigationProp<
  RootStackParamsList,
  'Tabs'
>;
type TabsScreenRouteProp = RouteProp<RootStackParamsList, 'Tabs'>;

type OwnProps = {
  navigtation: TabsScreenNavigationProp;
  route: TabsScreenRouteProp;
};

const mapState = ({ theme }: RootState) => ({
  theme,
});

const mapDispatch = (dispatch: AppDispatch) => ({
  dispatch,
});

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = OwnProps & PropsFromRedux;

export default connect(mapState)(Tabs);

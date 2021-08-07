import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import {
  black,
  NAVIGATION_HEADER_FONT_SIZE,
  NAVIGATION_HEADER_HEIGHT,
  white,
} from '../styles';
import { Theme } from '../types';
import Sudoku from './Sudoku';
import TabsNavigator from './TabsNavigator';

type StackParamList = {
  TabsNavigator: { name: string };
  Sudoku: { name: string; title: string; id: string };
};

interface NavigatorProps {
  theme?: Theme;
}

const Stack = createStackNavigator<StackParamList>();

function StackNavigator({ theme }: NavigatorProps) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: 'center',
        headerTintColor: theme ? theme.colors.cellSelectedText : white,
        headerStyle: {
          backgroundColor: theme ? theme.colors.cellSelectedBackground : black,
          height: NAVIGATION_HEADER_HEIGHT,
        },
        headerTitleStyle: {
          fontSize: NAVIGATION_HEADER_FONT_SIZE,
        },
      }}
    >
      <Stack.Screen
        name='TabsNavigator'
        options={{
          headerShown: false,
        }}
      >
        {(props) => <TabsNavigator {...props} extraData={{ theme: theme }} />}
      </Stack.Screen>
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
}

export default StackNavigator;

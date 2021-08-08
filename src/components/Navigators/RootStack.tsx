import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { createStackNavigator } from '@react-navigation/stack';

import { AppDispatch, RootState } from '../../storage/store';
import {
  NAVIGATION_HEADER_FONT_SIZE,
  NAVIGATION_HEADER_HEIGHT,
} from '../../styles';

import Tabs from './Tabs';
import Sudoku from '../Sudoku';

const Stack = createStackNavigator<RootStackParamsList>();

const RootStack: React.FC<Props> = ({ theme }) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: 'center',
        headerTintColor: theme.colors.cellSelectedText,
        headerStyle: {
          backgroundColor: theme.colors.cellSelectedBackground,
          height: NAVIGATION_HEADER_HEIGHT,
        },
        headerTitleStyle: {
          fontSize: NAVIGATION_HEADER_FONT_SIZE,
        },
      }}
    >
      <Stack.Screen
        name='Tabs'
        component={Tabs}
        options={{ headerShown: false }}
        // NOTE: can pass additional props via initial params to Tabs component
        // initialParams={{ theme: theme }}
      />
      <Stack.Screen
        name='Sudoku'
        component={Sudoku}
        initialParams={{
          title: 'Sudoku',
        }}
        options={({ route }) => ({
          title: route.params.title,
          headerShown: true,
        })}
      />
    </Stack.Navigator>
  );
};

export type RootStackParamsList = {
  Tabs: undefined; // { theme: Theme }; <-- Can pass additional props via initialParams to Tabs component
  Sudoku: { title: string; id: string };
};

interface OwnProps {}

const mapState = ({ theme }: RootState) => ({
  theme,
});

const mapDispatch = (dispatch: AppDispatch) => ({
  dispatch,
});

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = OwnProps & PropsFromRedux;

export default connect(mapState)(RootStack);

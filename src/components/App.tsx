import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { connect, ConnectedProps } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';

import {
  AppDispatch,
  RootState,
  initSudokuGameDataAsync,
  initSudokuUserAsync,
  initAppOptionsAsync,
} from '../storage/store';

import RootStack from './Navigators';
import StatusBar from './StatusBar';

const App: React.FC<Props> = ({ status, theme, dispatch }) => {
  useEffect(() => {
    dispatch(initSudokuUserAsync());
    dispatch(initSudokuGameDataAsync());
    dispatch(initAppOptionsAsync());
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor={theme.colors.primary}
        barStyle={theme.colors.barStyle}
      />
      <NavigationContainer>
        <RootStack />
      </NavigationContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

type OwnProps = {};

const mapState = ({ status, theme }: RootState) => ({
  theme,
  status,
});

const mapDispatch = (dispatch: AppDispatch) => ({
  dispatch,
});

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = OwnProps & PropsFromRedux;

export default connect(mapState)(App);

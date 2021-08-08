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

import StatusBar from './StatusBar';
import RootStack from './Navigators';

const App: React.FC<Props> = ({ status, theme, dispatch }) => {
  useEffect(() => {
    dispatch(initSudokuUserAsync());
    dispatch(initSudokuGameDataAsync());
    dispatch(initAppOptionsAsync());
  }, []);

  return (
    <View style={styles.container}>
      <View>
        <StatusBar backgroundColor={theme.colors.primary} />
      </View>
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

interface OwnProps {}

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

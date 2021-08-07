import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

// Redux
import { connect, ConnectedProps } from 'react-redux';
import {
  AppDispatch,
  RootState,
  initSudokuGameDataAsync,
  initSudokuUserAsync,
  initAppOptionsAsync,
} from '../storage/store';

import { NavigationContainer } from '@react-navigation/native';
import StatusBar from './StatusBar';
import StackNavigator from './StackNavigator';

function App({ dispatch, status, theme }: Props) {
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
        <StackNavigator theme={theme} />
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

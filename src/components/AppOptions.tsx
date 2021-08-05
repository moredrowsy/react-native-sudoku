import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { connect, ConnectedProps } from 'react-redux';
import { AppDispatch, RootState } from '../storage/store';
import { setShowHintsAsync } from '../storage/store';
import { blue, gray } from '../styles';
import CheckBox from './CheckBox';

function AppOptions({ options, dispatch }: Props) {
  const [showHints, setShowHints] = useState(options.showHints);

  const onShowHintsToggle = (newValue: boolean) => {
    setShowHints(newValue);
    dispatch(setShowHintsAsync(newValue));
  };

  return (
    <View style={styles.container}>
      <View style={styles.option}>
        <CheckBox
          disabled={false}
          value={showHints}
          onValueChange={(newValue) => onShowHintsToggle(newValue)}
          onColor={blue}
          offColor={gray}
        />
        <TouchableOpacity onPress={() => onShowHintsToggle(!showHints)}>
          <Text style={styles.text}>Show hints</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  option: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 30,
  },
  text: {
    fontSize: 15,
  },
});

interface OwnProps {}

const mapState = ({ options }: RootState) => ({
  options,
});

const mapDispatch = (dispatch: AppDispatch) => ({
  dispatch,
});

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = OwnProps & PropsFromRedux;

export default connect(mapState)(AppOptions);

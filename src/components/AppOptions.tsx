import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { connect, ConnectedProps } from 'react-redux';
import { Picker } from '@react-native-picker/picker';

import { RouteProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { TabsParamList } from './Navigators/Tabs';

import {
  AppDispatch,
  RootState,
  setShowHintsAsync,
  setShowRevealAsync,
  setThemeNameAsync,
} from '../storage/store';
import { BOARD_PADDING, colorsMap, themeNames } from '../styles';
import { ThemeNames } from '../types';

import CheckBox from './CheckBox';

const AppOptions: React.FC<Props> = ({ options, theme, dispatch }) => {
  const [showHints, setShowHints] = useState(options.showHints);
  const [showReveal, setShowReveal] = useState(options.showReveal);
  const [selectedTheme, setSelectedTheme] = useState(theme.name);

  const onShowHintsToggle = (newValue: boolean) => {
    setShowHints(newValue);
    dispatch(setShowHintsAsync(newValue));
  };

  const onShowRevealToggle = (newValue: boolean) => {
    setShowReveal(newValue);
    dispatch(setShowRevealAsync(newValue));
  };

  const onChangeThemeName = (themeName: ThemeNames) => {
    dispatch(setThemeNameAsync(themeName));
  };

  useEffect(() => {
    dispatch(setThemeNameAsync(selectedTheme));
  }, [selectedTheme]);

  return (
    <View style={styles.container}>
      <View style={styles.option}>
        <CheckBox
          disabled={false}
          value={showHints}
          onValueChange={(newValue) => onShowHintsToggle(newValue)}
          onColor={theme.colors.primary}
          offColor={theme.colors.inactive}
        />
        <TouchableOpacity onPress={() => onShowHintsToggle(!showHints)}>
          <Text style={styles.text}>Enable show hints</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.option}>
        <CheckBox
          disabled={false}
          value={showReveal}
          onValueChange={(newValue) => onShowRevealToggle(newValue)}
          onColor={theme.colors.primary}
          offColor={theme.colors.inactive}
        />
        <TouchableOpacity onPress={() => onShowRevealToggle(!showReveal)}>
          <Text style={styles.text}>
            Enable show reveal answers (if exists)
          </Text>
        </TouchableOpacity>
      </View>
      <View>
        <View style={{ padding: 5 }}>
          <Text
            style={[styles.themeHeader, { color: colorsMap[selectedTheme] }]}
          >
            Theme
          </Text>
        </View>
        <Picker
          selectedValue={selectedTheme}
          onValueChange={(itemValue, itemIndex) => setSelectedTheme(itemValue)}
        >
          {themeNames.map((themeName) => (
            <Picker.Item
              key={themeName}
              label={themeName}
              value={themeName}
              color={colorsMap[themeName]}
            />
          ))}
        </Picker>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    margin: BOARD_PADDING,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  text: {
    fontSize: 18,
  },
  themeHeader: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  currentThemeText: {
    fontWeight: 'bold',
  },
});

type AppOptionsNavigationProp = BottomTabNavigationProp<
  TabsParamList,
  'AppOptions'
>;
type AppOptionsRouteProp = RouteProp<TabsParamList, 'AppOptions'>;

type OwnProps = {
  navigation: AppOptionsNavigationProp;
  route: AppOptionsRouteProp;
};

const mapState = ({ options, theme }: RootState) => ({
  options,
  theme,
});

const mapDispatch = (dispatch: AppDispatch) => ({
  dispatch,
});

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = OwnProps & PropsFromRedux;

export default connect(mapState)(AppOptions);

import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { connect, ConnectedProps } from 'react-redux';

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
import { themeNames } from '../styles';
import { ThemeNames } from '../types';

import CheckBox from './CheckBox';

function AppOptions({ options, theme, dispatch }: Props) {
  const [showHints, setShowHints] = useState(options.showHints);
  const [showReveal, setShowReveal] = useState(options.showReveal);

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
      <View style={styles.optionList}>
        <View>
          <Text style={[styles.themeHeader, { color: theme.colors.primary }]}>
            Themes
          </Text>
        </View>
        {themeNames.map((themeName) => (
          <View key={themeName}>
            {options.themeName === themeName ? (
              <View>
                <Text
                  style={[
                    styles.text,
                    styles.currentThemeText,
                    {
                      color: theme.colors.primary,
                    },
                  ]}
                >
                  {themeName}
                </Text>
              </View>
            ) : (
              <TouchableOpacity onPress={() => onChangeThemeName(themeName)}>
                <Text style={[styles.text, { color: theme.colors.inactive }]}>
                  {themeName}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
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
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 30,
  },
  optionList: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 30,
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

type HomeScreenNavigationProp = BottomTabNavigationProp<
  TabsParamList,
  'AppOptions'
>;
type HomeScreenRouteProp = RouteProp<TabsParamList, 'AppOptions'>;

type OwnProps = {
  navigation: HomeScreenNavigationProp;
  route: HomeScreenRouteProp;
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

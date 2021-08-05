import React from 'react';
import { View } from 'react-native';
import { StatusBar as ExpoStatusBar, StatusBarStyle } from 'expo-status-bar';
import Consants from 'expo-constants';
import { black } from '../styles';

export default function StatusBar({
  backgroundColor = black,
  theme = 'light',
}: Props) {
  return (
    <View
      style={{
        backgroundColor,
        height: Consants.statusBarHeight,
      }}
    >
      <ExpoStatusBar translucent style={theme} />
    </View>
  );
}

interface Props {
  backgroundColor?: string;
  theme?: StatusBarStyle;
}

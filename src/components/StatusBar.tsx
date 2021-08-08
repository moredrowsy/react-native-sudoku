import React from 'react';
import { View } from 'react-native';
import { StatusBar as ExpoStatusBar, StatusBarStyle } from 'expo-status-bar';
import Consants from 'expo-constants';
import { black } from '../styles';

const StatusBar: React.FC<Props> = ({
  backgroundColor = black,
  theme = 'light',
}) => {
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
};

export default StatusBar;

interface Props {
  backgroundColor?: string;
  theme?: StatusBarStyle;
}

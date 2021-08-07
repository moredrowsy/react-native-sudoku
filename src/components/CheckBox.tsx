import React from 'react';
import { Platform, StyleProp, View } from 'react-native';
import NativeCheckBox from '@react-native-community/checkbox';
import { indigo, gray } from '../styles';

function CheckBox({
  disabled,
  onColor,
  offColor,
  onValueChange,
  style,
  value,
}: Props) {
  if (
    Platform.OS === 'ios' ||
    Platform.OS === 'android' ||
    Platform.OS === 'windows'
  ) {
    return (
      <View>
        <NativeCheckBox
          disabled={disabled}
          value={value}
          onValueChange={onValueChange}
          style={style}
          tintColors={{
            true: onColor ? onColor : indigo,
            false: offColor ? offColor : gray,
          }}
        />
      </View>
    );
  } else if (Platform.OS === 'web') {
    return (
      <input
        type='checkbox'
        checked={value}
        onChange={() => onValueChange(!value)}
        style={style}
      />
    );
  } else {
    // macOS is not yet supported
    return <View></View>;
  }
}

export default CheckBox;

interface Props {
  disabled?: boolean;
  onValueChange: (value: boolean) => void;
  value: boolean;
  style?: StyleProp<any>;
  onColor?: string;
  offColor?: string;
}

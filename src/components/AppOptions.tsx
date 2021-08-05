import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

function AppOptions() {
  return (
    <View style={styles.container}>
      <Text>App Options</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AppOptions;

import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { AppDispatch, RootState } from '../storage/store';
import { connect, ConnectedProps } from 'react-redux';

const HEADER_ICON_SIZE = 30;

const LongPressHeader: React.FC<Props> = ({ onCancel, onRemove, theme }) => {
  return (
    <View style={styles.container}>
      {onRemove && (
        <>
          <TouchableOpacity onPress={onRemove}>
            <MaterialCommunityIcons
              name='trash-can'
              size={HEADER_ICON_SIZE}
              color={theme.colors.selectedText}
            />
          </TouchableOpacity>
          <View style={styles.seperator}></View>
        </>
      )}
      <TouchableOpacity onPress={onCancel}>
        <MaterialIcons
          name='cancel'
          size={HEADER_ICON_SIZE}
          color={theme.colors.selectedText}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  seperator: {
    marginLeft: 10,
  },
});

type OwnProps = {
  onCancel?: () => void;
  onRemove?: () => void;
};

const mapState = ({ theme }: RootState) => ({
  theme,
});

const mapDispatch = (dispatch: AppDispatch) => ({
  dispatch,
});

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = OwnProps & PropsFromRedux;

export default connect(mapState)(LongPressHeader);

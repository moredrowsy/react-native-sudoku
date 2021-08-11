import React from 'react';
import { StatusBar as NativeStatusBar, StatusBarStyle } from 'react-native';
import { connect, ConnectedProps } from 'react-redux';
import { AppDispatch, RootState } from '../storage/store';

const StatusBar: React.FC<Props> = ({ statusBarVisible, theme }) => {
  return (
    <NativeStatusBar
      backgroundColor={theme.colors.primary}
      barStyle={theme.colors.barStyle}
      hidden={!statusBarVisible}
    />
  );
};

type OwnProps = {
  backgroundColor: string;
  barStyle: StatusBarStyle;
};

const mapState = ({ status, theme }: RootState) => ({
  theme,
  statusBarVisible: status.statusBarVisible,
});

const mapDispatch = (dispatch: AppDispatch) => ({
  dispatch,
});

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = OwnProps & PropsFromRedux;

export default connect(mapState)(StatusBar);

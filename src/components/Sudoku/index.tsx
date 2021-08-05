import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { StyleSheet, Text, View } from 'react-native';
import { AppDispatch, RootState } from '../../storage/store';
import Board from './Board';
import Controller from './Controller';
import Info from './Info';

const GAP_BETWEEN_COMPONENTS = 30;

function Sudoku({ hasSudokuGameForUser, id, userId }: Props) {
  if (hasSudokuGameForUser && userId) {
    return (
      <View style={styles.container}>
        <View style={styles.info}>
          <Info id={id} userId={userId} />
        </View>
        <View style={styles.board}>
          <Board
            id={id}
            userId={userId}
            isPressable={true}
            noSelectedColor={false}
          />
        </View>
        <View style={styles.controller}>
          <Controller id={id} userId={userId} />
        </View>
      </View>
    );
  } else {
    return <View></View>;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  board: {
    marginTop: GAP_BETWEEN_COMPONENTS,
    marginBottom: GAP_BETWEEN_COMPONENTS,
  },
  info: {
    marginTop: GAP_BETWEEN_COMPONENTS,
  },
  controller: {
    marginBottom: GAP_BETWEEN_COMPONENTS,
  },
});

interface OwnProps {
  id: string;
  route: any; // TODO fix this type
}

const mapState = ({ status, users }: RootState, { route }: OwnProps) => {
  let hasSudokuGameForUser = false;

  const id = route.params.id;
  const { userId } = status;
  if (userId && userId in users) {
    const { sudokus } = users[userId];

    if (id in sudokus) {
      hasSudokuGameForUser = true;
    }
  }

  return {
    hasSudokuGameForUser,
    id,
    userId,
  };
};

const mapDispatch = (dispatch: AppDispatch) => ({
  dispatch,
});

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = OwnProps & PropsFromRedux;

export default connect(mapState)(Sudoku);

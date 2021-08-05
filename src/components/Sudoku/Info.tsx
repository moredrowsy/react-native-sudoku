import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { connect, ConnectedProps } from 'react-redux';
import { AppDispatch, RootState } from '../../storage/store';
import { blue, green } from '../../styles';

function Info({ total, defaultScore, userScore }: Props) {
  if (defaultScore && userScore && total) {
    return (
      <View>
        {userScore === total ? (
          <Text style={styles.completed}>Completed!</Text>
        ) : (
          <Text style={styles.score}>
            Score: {userScore} / {total}
          </Text>
        )}
      </View>
    );
  } else {
    return <ActivityIndicator size='large' color={blue} />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  score: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  completed: {
    color: green,
    fontSize: 20,
    fontWeight: 'bold',
  },
});

interface OwnProps {
  id: string;
  userId: string;
}

const mapState = ({ users }: RootState, { id, userId }: OwnProps) => {
  let defaultScore = null;
  let userScore = null;
  let total = null;

  if (userId && userId in users && id in users[userId].sudokus) {
    const sudoku = users[userId].sudokus[id];
    total = sudoku.board.length * sudoku.board.length;
    defaultScore = sudoku.defaultScore;
    userScore = sudoku.userScore;
  }

  return {
    defaultScore,
    total,
    userScore,
  };
};

const mapDispatch = (dispatch: AppDispatch) => ({
  dispatch,
});

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = OwnProps & PropsFromRedux;

export default connect(mapState)(Info);

import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { connect, ConnectedProps } from 'react-redux';
import {
  AppDispatch,
  RootState,
  updateGameWithSolutionAsync,
} from '../../storage/store';
import { black, blue, green } from '../../styles';

export const INFO_FONT_SIZE = 20;

function Info({
  id,
  userId,
  total,
  defaultHasSolution,
  defaultScore,
  userScore,
  dispatch,
}: Props) {
  if (defaultScore && userScore && total) {
    // Update default game data with user's solution if it does not have any
    useEffect(() => {
      if (!defaultHasSolution && userScore === total) {
        dispatch(updateGameWithSolutionAsync(id, userId));
      }
    }, [defaultHasSolution, userScore, total]);

    return (
      <View>
        {userScore === total ? (
          <Text style={styles.completed}>Completed!</Text>
        ) : (
          <Text style={styles.score}>
            {userScore} / {total}
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
    fontSize: INFO_FONT_SIZE,
    fontWeight: 'bold',
    color: black,
  },
  completed: {
    color: green,
    fontSize: INFO_FONT_SIZE,
    fontWeight: 'bold',
  },
});

interface OwnProps {
  id: string;
  userId: string;
}

const mapState = ({ users, sudokus }: RootState, { id, userId }: OwnProps) => {
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
    id,
    userId,
    defaultHasSolution: id in sudokus ? sudokus[id].hasSolution : null,
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

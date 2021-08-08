import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { connect, ConnectedProps } from 'react-redux';
import {
  AppDispatch,
  RootState,
  updateGameWithSolutionAsync,
} from '../../storage/store';
import { black, green } from '../../styles';

export const INFO_FONT_SIZE = 20;

const Info: React.FC<Props> = ({
  id,
  userId,
  defaultHasSolution,
  defaultScore,
  isPortrait,
  theme,
  total,
  userScore,
  dispatch,
}) => {
  if (defaultScore && userScore && total) {
    // Update default game data with user's solution if it does not have any
    useEffect(() => {
      if (!defaultHasSolution && userScore === total) {
        dispatch(updateGameWithSolutionAsync(id, userId));
      }
    }, [defaultHasSolution, userScore, total]);

    const completeMsg = 'Completed!';

    return (
      <View>
        {userScore === total ? (
          <View>
            {isPortrait ? (
              <Text style={styles.completed}>{completeMsg}</Text>
            ) : (
              <View style={styles.verticalText}>
                {[...completeMsg].map((c, index) => (
                  <Text key={`${index}${c}`} style={styles.completed}>
                    {c}
                  </Text>
                ))}
              </View>
            )}
          </View>
        ) : (
          <View style={isPortrait ? styles.portrait : styles.landscape}>
            <Text style={styles.score}>{userScore}</Text>
            <Text style={styles.score}>{isPortrait ? ' / ' : '—'}</Text>
            <Text style={styles.score}>{total}</Text>
          </View>
        )}
      </View>
    );
  } else {
    return <ActivityIndicator size='large' color={theme.colors.primary} />;
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  landscape: {
    flexDirection: 'column',
  },
  portrait: {
    flexDirection: 'row',
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
  verticalText: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

interface OwnProps {
  id: string;
  userId: string;
  isPortrait: boolean;
}

const mapState = (
  { users, sudokus, theme }: RootState,
  { id, userId }: OwnProps
) => {
  const boardSize = users[userId].sudokus[id]?.board.length;
  const total = boardSize * boardSize;

  return {
    id,
    userId,
    defaultHasSolution: sudokus[id]?.hasSolution,
    defaultScore: users[userId].sudokus[id]?.defaultScore,
    theme,
    total,
    userScore: users[userId].sudokus[id]?.userScore,
  };
};

const mapDispatch = (dispatch: AppDispatch) => ({
  dispatch,
});

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = OwnProps & PropsFromRedux;

export default connect(mapState)(Info);

import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { connect, ConnectedProps } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

import {
  AppDispatch,
  RootState,
  updateGameWithSolutionAsync,
} from '../../../storage/store';
import { black, BOARD_PADDING, green, INFO_FONT_SIZE } from '../../../styles';

const GameInfo: React.FC<Props> = ({
  id,
  userId,
  boardSize,
  cellDimension,
  defaultHasSolution,
  defaultScore,
  isPortrait,
  onGoBack,
  theme,
  total,
  userScore,

  dispatch,
}) => {
  // Update default game data with user's solution if it does not have any
  useEffect(() => {
    if (!defaultHasSolution && userScore === total) {
      dispatch(updateGameWithSolutionAsync(id, userId));
    }
  }, [defaultHasSolution, userScore, total]);

  const completeMsg = 'Completed!';

  return (
    <View
      style={isPortrait ? styles.containerPortrait : styles.containerLandscape}
    >
      <View
        style={
          isPortrait
            ? styles.backBtnContainerPortrait
            : styles.backBtnContainerLandscape
        }
      >
        <TouchableOpacity onPress={onGoBack}>
          <Ionicons
            name='arrow-back'
            size={cellDimension}
            color={theme.colors.primary}
          />
        </TouchableOpacity>
      </View>
      <View
        style={
          isPortrait
            ? styles.infoContainerPortrait
            : styles.infoContainerLandscape
        }
      >
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
    </View>
  );
};

const styles = StyleSheet.create({
  containerLandscape: {
    justifyContent: 'flex-start',
    flex: 1,
  },
  containerPortrait: {},
  backBtnContainerLandscape: {},
  backBtnContainerPortrait: {
    display: 'none',
  },
  infoContainerLandscape: {
    marginTop: BOARD_PADDING,
  },
  infoContainerPortrait: {},
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
    textAlign: 'center',
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

type OwnProps = {
  id: string;
  userId: string;
  cellDimension: number;
  boardSize: number;
  isPortrait: boolean;
  onGoBack: () => void;
};

const mapState = (
  { users, sudokus, theme }: RootState,
  { id, userId, boardSize }: OwnProps
) => {
  const total = boardSize * boardSize;

  return {
    id,
    userId,
    boardSize,
    defaultHasSolution: sudokus[id]?.hasSolution,
    defaultScore: users[userId].sudokus[id]?.defaultScore,
    theme,
    total,
    userScore: users[userId].sudokus[id].userScore,
  };
};

const mapDispatch = (dispatch: AppDispatch) => ({
  dispatch,
});

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = OwnProps & PropsFromRedux;

export default connect(mapState)(GameInfo);

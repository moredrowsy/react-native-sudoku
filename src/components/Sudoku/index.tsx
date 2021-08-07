import React, { useEffect } from 'react';
import { debounce } from 'lodash';
import { connect, ConnectedProps } from 'react-redux';
import { Dimensions, View } from 'react-native';
import { AppDispatch, RootState } from '../../storage/store';
import Board from './Board';
import Controller from './Controller';
import Info from './Info';
import { DEBOUNCE_WAIT } from '../../sudoku';

function Sudoku({ id, userId, hasSudokuGameForUser, theme }: Props) {
  if (hasSudokuGameForUser && userId) {
    const [dimensions, setDimensions] = React.useState({
      height: Dimensions.get('window').height,
      width: Dimensions.get('window').width,
    });

    // Listens for window size changes
    useEffect(() => {
      const debouncedHandleResize = debounce(function handleResize() {
        const { height, width } = Dimensions.get('window');
        setDimensions({
          height: height,
          width: width,
        });
      }, DEBOUNCE_WAIT);
      Dimensions.addEventListener('change', debouncedHandleResize);

      return () => {
        debouncedHandleResize.cancel();
        Dimensions.removeEventListener('change', debouncedHandleResize);
      };
    }, []);

    // Get screen orientation
    const screen = Dimensions.get('window');
    const isPortrait = screen.width <= screen.height;

    // Set screenStyles theme based on screen type
    const screenStyles = isPortrait ? theme.portrait : theme.landscape;

    return (
      <View style={screenStyles.sudokuContainer}>
        <View style={screenStyles.sudokuContainerForInfo}>
          <Info id={id} userId={userId} />
        </View>
        <View style={screenStyles.sudokuContainerForBoard}>
          <Board
            id={id}
            userId={userId}
            isPressable={true}
            hideSelectedColor={false}
          />
        </View>
        <View style={screenStyles.sudokuContainerForController}>
          <Controller id={id} userId={userId} />
        </View>
      </View>
    );
  } else {
    return <View></View>;
  }
}

interface OwnProps {
  id: string;
  route: any; // TODO fix this type
}

const mapState = ({ status, theme, users }: RootState, { route }: OwnProps) => {
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
    theme,
  };
};

const mapDispatch = (dispatch: AppDispatch) => ({
  dispatch,
});

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = OwnProps & PropsFromRedux;

export default connect(mapState)(Sudoku);

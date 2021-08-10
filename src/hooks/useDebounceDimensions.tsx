import React, { useEffect } from 'react';
import { Dimensions } from 'react-native';
import { debounce } from 'lodash';
import { DEBOUNCE_WAIT } from '../sudoku';

const useDebounceDimensions = (wait: number = DEBOUNCE_WAIT) => {
  const [dimensions, setDimensions] = React.useState({
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
  });
  // Get screen orientation
  const screen = Dimensions.get('window');
  const isPortrait = screen.width <= screen.height;
  const isLandscape = !isPortrait;

  // Listens for window size changes
  useEffect(() => {
    const debouncedHandleResize = debounce(function handleResize() {
      const { height, width } = Dimensions.get('window');
      setDimensions({
        height: height,
        width: width,
      });
    }, wait);
    Dimensions.addEventListener('change', debouncedHandleResize);

    return () => {
      debouncedHandleResize.cancel();
      Dimensions.removeEventListener('change', debouncedHandleResize);
    };
  }, []);

  return { ...dimensions, isLandscape, isPortrait };
};

export default useDebounceDimensions;

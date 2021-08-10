import React, { useEffect } from 'react';
import { Dimensions, useWindowDimensions } from 'react-native';
import { debounce } from 'lodash';
import { DEBOUNCE_WAIT } from '../sudoku';

const useDebounceDimensions = (wait: number = DEBOUNCE_WAIT) => {
  // Get screen orientation
  const screen = Dimensions.get('window');
  const isPortrait = screen.width <= screen.height;
  const isLandscape = !isPortrait;

  if (wait > 0) {
    const [dimensions, setDimensions] = React.useState({
      height: Dimensions.get('window').height,
      width: Dimensions.get('window').width,
      fontScale: Dimensions.get('window').fontScale,
      scale: Dimensions.get('window').scale,
    });

    // Listens for window size changes
    useEffect(() => {
      const debouncedHandleResize = debounce(function handleResize() {
        const { height, width, fontScale, scale } = Dimensions.get('window');
        setDimensions({
          height,
          width,
          fontScale,
          scale,
        });
      }, wait);
      Dimensions.addEventListener('change', debouncedHandleResize);

      return () => {
        debouncedHandleResize.cancel();
        Dimensions.removeEventListener('change', debouncedHandleResize);
      };
    }, []);

    return { ...dimensions, isLandscape, isPortrait };
  } else {
    const window = useWindowDimensions();
    return { ...window, isLandscape, isPortrait };
  }
};

export default useDebounceDimensions;

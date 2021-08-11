import React from 'react';
import { View } from 'react-native';
import { connect, ConnectedProps } from 'react-redux';

import { AppDispatch, RootState } from '../../storage/store';

// Board is presentational. It should be as stateless as possible to avoid
// rerenders. Only the states in Cells should know if it needs to rerender
const Board: React.FC<Props> = ({
  id,
  boardDimension = 0,
  data,
  isPortrait,
  renderItem,
  theme,
}) => {
  const boardSize = data.length;
  const subgridSize = Math.sqrt(boardSize);

  // Set styles theme based on screen type
  const styles = isPortrait ? theme.portrait : theme.landscape;

  return (
    <View
      style={{
        width: boardDimension,
        height: boardDimension,
      }}
    >
      <View style={styles.gridContainer}>
        {data.map((rows, row) => {
          return (
            <View key={row} style={styles.gridRowContainer}>
              {rows.map((item, col) => {
                const isSubRight =
                  col !== boardSize - 1 && col % subgridSize == 2;
                const isSubBottom =
                  row !== boardSize - 1 && row % subgridSize == 2;
                let cStyle = styles.gridColContainer;

                // Normal cell
                if (col !== 0 && row !== 0) {
                  if (isSubBottom && isSubRight) {
                    cStyle = styles.gridColCornerSubRightBottom;
                  } else if (isSubBottom) {
                    cStyle = styles.gridColContainerSubBottom;
                  } else if (isSubRight) {
                    cStyle = styles.gridColContainerSubRight;
                  } else {
                    cStyle = styles.gridColContainer;
                  }
                }
                // Top left
                else if (col === 0 && row === 0) {
                  cStyle = styles.gridColTopLeft;
                }
                // First col
                else if (col === 0) {
                  if (!isSubBottom) cStyle = styles.gridColFirstCol;
                  else cStyle = styles.gridColFirstColSubBottom;
                }
                // First row
                else if (row === 0) {
                  if (!isSubRight) cStyle = styles.gridColFirstRow;
                  else cStyle = styles.gridColFirstRowSubRight;
                } else {
                  cStyle = styles.gridColContainer;
                }

                return (
                  <View key={col} style={cStyle}>
                    {renderItem({ id, item, row, col })}
                  </View>
                );
              })}
            </View>
          );
        })}
      </View>
    </View>
  );
};

type OwnProps = {
  id: string;
  boardDimension: number;
  isPortrait?: boolean;
  data: any[][];
  renderItem: React.FC<BoardItemProps<any>>;
};

export type BoardItemProps<T> = {
  id: string;
  item: T;
  row: number;
  col: number;
};

const mapState = ({ theme }: RootState) => {
  return {
    theme,
  };
};

const mapDispatch = (dispatch: AppDispatch) => ({
  dispatch,
});

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = OwnProps & PropsFromRedux;

export default connect(mapState)(Board);

import React from 'react';
import { View } from 'react-native';
import { connect, ConnectedProps } from 'react-redux';

import { AppDispatch, RootState } from '../../storage/store';

// Grid is presentational. It should be as stateless as possible to avoid
// rerenders. Only the states in Cells should know if it needs to rerender
const Grid: React.FC<Props> = ({
  id,
  rowDimension,
  colDimension,
  data,
  isPortrait = true,
  renderItem,
  theme,
}) => {
  // Can not have 0 size otherwise division by zero
  const colSize = data[0] ? (data[0].length > 0 ? data[0].length : 1) : 1;
  const rowSize = data.length > 0 ? data.length : 1;
  const colSubgridSize = Math.sqrt(colSize);
  const rowSubgridSize = Math.sqrt(rowSize);

  const colCellDimension = colDimension / colSize;
  const rowCellDimension = rowDimension / rowSize;

  // Set styles theme based on screen type
  const styles = isPortrait ? theme.portrait : theme.landscape;

  return (
    <View
      style={
        isPortrait
          ? {
              width: rowDimension,
              height: colDimension,
            }
          : {
              width: colDimension,
              height: rowDimension,
            }
      }
    >
      <View style={styles.gridContainer}>
        {data.map((rows, row) => {
          return (
            <View key={row} style={styles.gridRowContainer}>
              {rows.map((item, col) => {
                let cStyle = styles.gridColContainer;

                if (isPortrait) {
                  const isSubRight =
                    col !== colSize - 1 && col % colSubgridSize == 2;
                  const isSubBottom =
                    row !== rowSize - 1 && row % rowSubgridSize == 2;

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
                }
                // NOTE
                // The !isPortrait styles are for mirroring diagonal backslash
                else {
                  const isSubBottom =
                    col !== colSize - 1 && col % colSubgridSize == 2;
                  const isSubRight =
                    row !== rowSize - 1 && row % rowSubgridSize == 2;

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
                    if (!isSubRight) cStyle = styles.gridColFirstRow;
                    else cStyle = styles.gridColFirstRowSubRight;
                  }
                  // First row
                  else if (row === 0) {
                    if (!isSubBottom) cStyle = styles.gridColFirstCol;
                    else cStyle = styles.gridColFirstColSubBottom;
                  } else {
                    cStyle = styles.gridColContainer;
                  }
                }

                return (
                  <View key={col} style={cStyle}>
                    {renderItem({
                      id,
                      item,
                      col,
                      row,
                      colCellDimension,
                      rowCellDimension,
                    })}
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
  data: any[][];
  colDimension: number;
  rowDimension: number;
  isPortrait?: boolean;
  renderItem: React.FC<GridItemProps<any>>;
};

export type GridItemProps<T> = {
  id: string;
  item: T;
  row: number;
  col: number;
  colCellDimension: number;
  rowCellDimension: number;
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

export default connect(mapState)(Grid);

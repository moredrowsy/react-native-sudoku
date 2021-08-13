import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import {
  AppDispatch,
  RootState,
  updateNewSudokuSelectedCell,
} from '../../../storage/store';
import { getIsCellInSelected } from '../../../sudoku';

import Cell from '../Cell';

const NewGameCell: React.FC<Props> = ({
  dimension,
  isCellInSelected,
  isSelected,
  sudokuCell,
  theme,
  dispatch,
}) => {
  let bgColor = theme.colors.background;
  let opColor = theme.colors.opacityBackground;
  let txtColor = theme.colors.text;

  if (isSelected) {
    bgColor = theme.colors.selectedBackground;
    opColor = theme.colors.selectedOpacity;
    txtColor = theme.colors.selectedText;
  } else if (isCellInSelected) {
    bgColor = theme.colors.highlightBackground;
    txtColor = theme.colors.highlightText;
  }

  const onCellPress = () => {
    if (sudokuCell) {
      // Unselect cell if it is already selected
      // Otherwise, set selected cell as this row, col
      const cell = isSelected ? null : sudokuCell;

      dispatch(updateNewSudokuSelectedCell(cell));
    }
  };

  return (
    <Cell
      value={sudokuCell.value}
      backgroundColor={bgColor}
      opacityColor={opColor}
      textColor={txtColor}
      dimension={dimension}
      isPressable={true}
      onPress={onCellPress}
    />
  );
};

type OwnProps = {
  col: number;
  row: number;
  dimension: number;
};

const mapState = ({ newSudoku, theme }: RootState, { col, row }: OwnProps) => {
  const sudokuCell = newSudoku.board[row][col];
  const selectedCell = newSudoku.selectedCell;
  const isCellInSelected = getIsCellInSelected(
    sudokuCell,
    selectedCell,
    newSudoku.board.length
  );

  return {
    isCellInSelected,
    isSelected: selectedCell
      ? col === selectedCell.col && row === selectedCell.row
      : false,
    sudokuCell,
    theme,
  };
};

const mapDispatch = (dispatch: AppDispatch) => ({
  dispatch,
});

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = OwnProps & PropsFromRedux;

export default connect(mapState)(NewGameCell);

import React, { createContext, useState, ReactNode } from 'react';
import { Cell } from '../interfaces/cell';

type MatrixContextType = {
  matrix: Cell[][];
  valueX: number;
  setMatrix: React.Dispatch<React.SetStateAction<Cell[][]>>;
  createMatrix: (M: number, N: number, X: number) => void;
  calculateRowSum: (row: Cell[]) => number;
  calculateColumnMedian: () => number[];
};

export const MatrixContext = createContext<MatrixContextType | undefined>(undefined);

export const MatrixProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [matrix, setMatrix] = useState<Cell[][]>([]);
  const [valueX, setValueX] = useState<number>(0);

  // Function to generate the matrix
  const createMatrix = (M: number, N: number, X: number) => {
    let cellId = 1;
    const generatedMatrix: Cell[][] = [];
    for (let i = 0; i < M; i++) {
      const row: Cell[] = [];
      for (let j = 0; j < N; j++) {
        row.push({
          id: cellId++,
          amount: Math.floor(100 + Math.random() * 900),
        });
      }
      generatedMatrix.push(row);
    }
    setMatrix(generatedMatrix);
    setValueX(X);
  };

  const calculateRowSum = (row: Cell[]): number => {
    return row.reduce((sum, cell) => sum + cell.amount, 0);
  };

  const calculateColumnMedian = (): number[] => {
    const numCols = matrix[0]?.length || 0;
    const medians: number[] = [];

    for (let col = 0; col < numCols; col++) {
      const columnValues = matrix.map(row => row[col]?.amount);
      const columnSum = columnValues.reduce((sum, value) => sum + value, 0);
      medians.push(columnSum / 2);
    }

    return medians;
  };

  return (
    <MatrixContext.Provider value={{ matrix, valueX, setMatrix, createMatrix, calculateRowSum, calculateColumnMedian }}>
      {children}
    </MatrixContext.Provider>
  );
};
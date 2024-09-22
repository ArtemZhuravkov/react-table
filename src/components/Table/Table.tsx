import { useContext } from "react";
import { MatrixContext } from "../../context/MatrixContext";
import "./Table.css";
import { TableRows } from "../TableRows/TableRows";

export const Table: React.FC = () => {
  const matrixContext = useContext(MatrixContext);

  if (!matrixContext) {
    throw new Error('MatrixContext must be used within a MatrixProvider');
  }

  const { matrix, calculateColumnMedian, setMatrix } = matrixContext;

  const handleCellClick = (rowIndex: number, colIndex: number) => {
    const newMatrix = [...matrix];
    const cell = newMatrix[rowIndex][colIndex];

    if (cell) {
      cell.amount += 1; // Increment the amount by 1
      setMatrix(newMatrix); // Update the matrix state
    }
  };

  // Function to remove a row
  const handleRemoveRow = (rowIndex: number) => {
    const newMatrix = matrix.filter((_, index) => index !== rowIndex);
    setMatrix(newMatrix);
  };

  // Function to add a new row
  const handleAddRow = () => {
    const newRow = Array.from({ length: matrix[0].length }, (_, colIndex) => ({
      id: Date.now() + colIndex,
      amount: 0,
    }));
    const newMatrix = [...matrix, newRow];
    setMatrix(newMatrix);
  };

  return (
    <div>{matrix.length > 0 && (
      <div>
        <h3>Generated data</h3>
        <button onClick={handleAddRow} className="add-button">Add Row</button>
        <table>
          <thead>
            <tr>
              <th></th>
              {matrix[0].map((_, colIndex) => (
                <th key={colIndex}>
                  Column {colIndex + 1}
                </th>
              ))}
              <th>Row Sum</th>
            </tr>
          </thead>
          <TableRows
            handleCellClick={handleCellClick}
            handleRemoveRow={handleRemoveRow}
          />
          <tfoot>
            <tr>
              <td>50th Percentile</td>
              {calculateColumnMedian().map((median, index) => (
                <td key={index}>
                  {median}
                </td>
              ))}
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    )}</div>
  )
}

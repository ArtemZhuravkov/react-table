import { useContext, useMemo, useState } from "react";
import { MatrixContext } from "../../context/MatrixContext";
import { Cell } from "../../interfaces/cell";
import { getHeatmapStyle } from "../Table/helpers";
import "./TableRows.css";

interface IRowProps {
    handleCellClick: (rowIndex: number, colIndex: number) => void;
    handleRemoveRow: (rowIndex: number) => void;
}

export const TableRows: React.FC<IRowProps> = ({
    handleCellClick,
    handleRemoveRow
}) => {
    const matrixContext = useContext(MatrixContext);

    const [hoveredCell, setHoveredCell] = useState<{ rowIndex: number; colIndex: number, id: number } | null>(null);
    const [hoveredSumCell, setHoveredSumCell] = useState<number | null>(null);


    if (!matrixContext) {
        throw new Error('MatrixContext must be used within a MatrixProvider');
    }

    const { matrix, valueX, calculateRowSum } = matrixContext;


    const nearestCells = useMemo(() => {
        if (hoveredCell) {
            const { rowIndex, colIndex, id } = hoveredCell;
            const value = matrix[rowIndex][colIndex].amount;

            const flatMatrix = matrix.flat().filter(cell => cell.id !== id);

            const sortedCells = flatMatrix
                .map((cell, index) => ({
                    cell,
                    index,
                    distance: Math.abs(cell.amount - value),
                }))
                .sort((a, b) => a.distance - b.distance)
                .slice(0, valueX);
            return sortedCells.map(item => ({
                rowIndex: Math.floor(item.index / matrix[0].length),
                colIndex: item.index % matrix[0].length,
                id: item.cell.id
            }));
        }
        return [];
    }, [hoveredCell, matrix, valueX]);

    const cellClasses = useMemo(() => {
        return matrix.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
                const isHovered = hoveredCell?.rowIndex === rowIndex && hoveredCell?.colIndex === colIndex;
                const isHighlighted = nearestCells.some(
                    nearest => nearest.id === cell.id
                );
                return `cell ${isHovered ? 'cell-hovered' : ''} ${isHighlighted ? 'cell-highlighted' : ''}`;
            })
        );
    }, [hoveredCell, nearestCells, matrix]);

    const getRowPercentages = (row: Cell[]) => {
        const rowSum = calculateRowSum(row);
        return row.map(cell => (rowSum > 0 ? (cell.amount / rowSum) * 100 : 0));
    };

    return (
        <tbody>
            {matrix.map((row, rowIndex) => {
                const percentages = getRowPercentages(row);
                const maxAmount = Math.max(...row.map(cell => cell.amount));
                return (
                    <tr key={rowIndex}>
                        <td>{rowIndex + 1}</td>
                        {row.map((cell, colIndex) => {
                            const cellClassName = cellClasses[rowIndex][colIndex];
                            const id = cell.id;
                            return (
                                <td
                                    key={cell.id}
                                    className={cellClassName}
                                    onClick={() => handleCellClick(rowIndex, colIndex)}
                                    onMouseEnter={() => {
                                        setHoveredCell({ rowIndex, colIndex, id })
                                    }}
                                    onMouseLeave={() => setHoveredCell(null)}
                                    style={hoveredSumCell === rowIndex ? getHeatmapStyle(cell.amount, maxAmount) : undefined}
                                >
                                    {hoveredSumCell === rowIndex ? percentages[colIndex].toFixed(2) + '%' : cell.amount}
                                </td>
                            );
                        })}
                        <td
                            onMouseEnter={() => setHoveredSumCell(rowIndex)}
                            onMouseLeave={() => setHoveredSumCell(null)}
                        >
                            {calculateRowSum(row)}
                        </td>
                        <td className="remove-button-cell">
                            <button onClick={() => handleRemoveRow(rowIndex)} className="remove-button">Remove</button>
                        </td>
                    </tr>
                )
            })}
        </tbody>
    );
};
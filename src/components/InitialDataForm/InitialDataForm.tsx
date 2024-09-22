import { useContext, useState } from "react";
import "./InitialDataForm.css";
import { MatrixContext } from "../../context/MatrixContext";

export const InitialDataForm: React.FC = () => {
    const [M, setM] = useState<number>(0);
    const [N, setN] = useState<number>(0);
    const [X, setX] = useState<number>(0);

    const matrixContext = useContext(MatrixContext);

    if (!matrixContext) {
        throw new Error('MatrixContext must be used within a MatrixProvider');
    }

    const { createMatrix } = matrixContext;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createMatrix(M, N, X);
    };

    return (
        <div>
            <h2>Initial Data</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-item">
                    <label>M (Rows): </label>
                    <input
                        type="number"
                        value={M}
                        onChange={(e) => setM(Math.min(100, Math.max(0, Number(e.target.value))))}
                        required
                    />
                </div>
                <div className="form-item">
                    <label>N (Columns): </label>
                    <input
                        type="number"
                        value={N}
                        onChange={(e) => setN(Math.min(100, Math.max(0, Number(e.target.value))))}
                        required
                    />
                </div>
                <div className="form-item">
                    <label>X: </label>
                    <input
                        type="number"
                        value={X}
                        onChange={(e) => setX(Number(e.target.value))}
                    />
                </div>
                <button type="submit" className="form-button">Generate table</button>
            </form>
        </div>
    )
}

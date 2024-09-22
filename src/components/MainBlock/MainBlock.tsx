import { InitialDataForm } from "../InitialDataForm/InitialDataForm";
import { Table } from "../Table/Table";
import { MatrixProvider } from "../../context/MatrixContext";

export const MainBlock: React.FC = () => {
    return (
        <MatrixProvider>
            <div>
                <InitialDataForm />
                <Table/>
            </div>
        </MatrixProvider>
    )
}
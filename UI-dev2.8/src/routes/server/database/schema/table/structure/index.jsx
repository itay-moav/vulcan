import { useDispatch,useSelector } from "react-redux";
import { Table} from "react-bootstrap";
import useCurrents from "../../../../../../services/useCurrents";
import { tableStructure } from "../../../../../../store/dbTreeSlice";
import { Jumbotron } from "../../../../../../components/atoms";
export default function TableStructure(){
    const dispatch = useDispatch();
    const {server,database,schema,table} = useCurrents();
    const structure = useSelector(tableStructure(server,database,schema,table));

    return (
        <Jumbotron>
        <Table striped bordered hover size="sm" variant="dark">
            <thead>
                <tr key="2">
                    <th>Field Name</th>
                    <th>Type</th>
                    <th>Collation</th>
                    <th>Constraints</th>
                </tr>
            </thead>
            <tbody>
                {structure.columns.map(tr=>{return (
                <tr key={tr.column_name}>
                    <td>{tr.column_name}</td>
                    <td>{tr.data_type}({tr.max_length})</td>
                    <td>{tr.collation_name}</td>
                    <td>{tr.is_primary_key === "1" ? "PK ,":""} {tr.is_nullable === "0"? "Not Null":""}</td>
                </tr>
                )})}
            </tbody>
        </Table>
        </Jumbotron>
    );
}

import { useEffect,useState } from "react";
import { useDispatch,useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { Table,Alert,Modal,Button } from "react-bootstrap";
import useCurrents from "../../services/useCurrents";
import { findConnectionNameByDbOrServer,loadDatabaseTables,fetchTableList } from '../../store/dbTreeSlice';
import { QueryActions,runQuery } from "../../store/querySlice";
import {LastQuery,QueryResults} from "../../components/query";

export default function ServersServerDatabasesDatabaseTables(){
    const [modalDanger, setModalDanger] = useState({show:false,tableName:''});
    const dispatch = useDispatch();
    const {server,database} = useCurrents();
    const connectionName = useSelector(findConnectionNameByDbOrServer(server,database));
    const dbTables = useSelector(fetchTableList(server,database));

    //init
    useEffect(
        ()=>{
            if(database){
                dispatch(loadDatabaseTables({connectionName,server,database}));
            }
            dispatch(QueryActions.reset());
        },[]
    );

    //NO TABLES
    if(dbTables.length === 0){
        return (<Alert variant="warning">No tables found in database [{database}]</Alert>);
    }

    //MODAL ACTIONS
    const resetModalAction=()=>{
        setModalDanger({show:false,tableName:'',text:'',query:''});
    }

    //Start the truncate table action
    const startEmpty = tableName => {
        const alertText = (<>You are about to empty table <b>[{tableName}]</b> Are you sure?</>);
        const query = `TRUNCATE TABLE ${tableName};`;
        setModalDanger({
            show:true,
            tableName,
            text:alertText,
            query,
            action: ()=>{
                dispatch(runQuery({ connectionName,server,database,query}));
                resetModalAction();//just reset
            }
        });
    }

    //start the drop table action
    const startDrop = tableName => {
        const alertText = (<>You are about to DROP table <b>[{tableName}]</b> Are you sure?</>);
        const query=`DROP TABLE ${tableName};`;
        setModalDanger({
            show:true,
            tableName,
            text:alertText,
            query,
            action: async () => {
                await dispatch(runQuery({ connectionName,server,database,query}));
                dispatch(loadDatabaseTables({connectionName,server,database}));
                resetModalAction();//just reset
            }
        });
    }

    //RENDER TABLE LISTS
    let previousSchema = '';
    return (
        <>
        <DangerAreaAction modalParams={modalDanger} onCancel={resetModalAction} />
        <LastQuery />
        <QueryResults noResults="hide" />
        <Table striped bordered hover size="sm" variant="dark">
        <tbody>
            {dbTables.map(tr=>{
                const key = `${tr.TABLE_SCHEMA}.${tr.TABLE_NAME}`;
                let schemaTR = null;
                if(tr.TABLE_SCHEMA !== previousSchema){
                    previousSchema = tr.TABLE_SCHEMA;
                    schemaTR = (<tr key={tr.TABLE_SCHEMA}><td colSpan="6"><b>{tr.TABLE_SCHEMA}</b></td></tr>)
                }
                return (
                    <>
                    {schemaTR}
                    <tr key={key}>
                        <td>{key}</td>
                        <td><NavLink to={`${key}/structure`}>[structure]</NavLink></td>
                        <td><NavLink to={`${key}/browse`}>[browse]</NavLink></td>
                        <td><span className="link" onClick={()=>{startEmpty(key)}}>[empty]</span></td>
                        <td><span className="link" onClick={()=>{startDrop(key)}}>[drop]</span></td>
                    </tr>
                    </>
            )})}
        </tbody>
    </Table>
    </>
    );
}


function DangerAreaAction({modalParams,onCancel}){

    return (
        <Modal
          show={modalParams.show}
          onHide={onCancel}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          contentClassName="danger"
        >
          <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter">
                <i className="fa fa-exclamation-triangle" aria-hidden="true"></i>&nbsp; DANGER ZONE!
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h4>{modalParams.text}</h4>
            <p>{modalParams.query}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={onCancel} variant="secondary">Cancel</Button>
            <Button onClick={modalParams.action} variant="danger">Execute</Button>
          </Modal.Footer>
        </Modal>
      );
}

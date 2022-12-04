import { useEffect } from "react";
import { useDispatch,useSelector } from "react-redux";
import useCurrents from "../../../../services/useCurrents";
import { findConnectionNameByDbOrServer } from '../../../../store/dbTreeSlice';
import { runQuery } from "../../../../store/querySlice";
import {LastQuery,QueryEditor} from "../../../../components/query";
import FormatedFieldsQueryResults from "./formatedFieldsQueryResults";
import { useNavigate } from "react-router-dom";
export default function TableFields(){
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {server,database,table} = useCurrents();
    const connectionName = useSelector(findConnectionNameByDbOrServer(server,database));
    const [schema,currentTable] = table.split('.');
    const query = `SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA='${schema}' AND TABLE_NAME='${currentTable}'`; 
    useEffect(
        ()=>{
            dispatch(runQuery({connectionName,server,database,query}));
        },[table]
    );

    return (
        <>
            <QueryEditor runTriggers={()=>navigate('./../sql')} />
            <LastQuery />
            <FormatedFieldsQueryResults />
        </>
    );
}


//TODO still enable the full/raw view of the query above

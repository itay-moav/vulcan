import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {LastQuery,QueryEditor,QueryResults} from "../../components/query";
import { QueryActions } from "../../store/querySlice";
export default function ServersServerDatabasesDatabaseSql(){
    const dispatch=useDispatch();
    useEffect(
        ()=>{
            dispatch(QueryActions.reset());
        },[]
    );
    return (
        <>
            <QueryEditor />
            <LastQuery />
            <QueryResults />
        </>
    );
}
import { Outlet } from "react-router-dom";
import TableRows from "./tableRows";
import TableFields from "./subroutes/fields";
import TableCreateSql from "./subroutes/createSql";
import TableSql from "./subroutes/sql";


export default function ServersServerDatabasesDatabaseTablesTable(){

    return <Outlet />
}

export {TableRows,TableFields,TableCreateSql,TableSql};

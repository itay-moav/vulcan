import React,{useEffect} from 'react';
import {Routes,Route,useNavigate,useLocation} from "react-router-dom";
import Layout from "./components/layout";

//pages
import Servers from "./routes/servers";
import ServersServerDatabases,{DatabasesSql,DatabasesTables,RefreshHandler} from "./routes/serversServerDatabases";
import ServersServerDatabasesDatabaseSchemaTablesTable,{  TableBrowse,
          TableSearch,
          TableInsert,
          TableCreateSql,
          TableStructure,
          TableSql,
          TableOperations } from "./routes/serversServerDatabasesDatabaseSchemaTablesTable";

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(
    ()=>{
      if(location.pathname === "/"){
        navigate('servers');
      }
     // eslint-disable-next-line
    },[]
  );
  return (
    <Routes>
      <Route path="/*" element={<Layout />}>
        
        <Route exact path="servers/:server/databases" element={<ServersServerDatabases />} />
        <Route path="servers/:server/databases/:database" element={<RefreshHandler />}>
          <Route exact path="tables" element={<DatabasesTables />} />
          <Route exact path="sql" element={<DatabasesSql />} />

          <Route exact path="schema/:schema">            
            <Route exact path="tables" element={<DatabasesTables />} />
            <Route exact path="sql" element={<DatabasesSql />} />

            <Route path="tables/:table" element={<ServersServerDatabasesDatabaseSchemaTablesTable />}>
              <Route exact path="browse" element={<TableBrowse />} />
              <Route exact path="search" element={<TableSearch />} />
              <Route exact path="insert" element={<TableInsert />} />
              <Route exact path="sql" element={<TableSql />} />
              <Route exact path="createsql" element={<TableCreateSql />} />
              <Route exact path="structure" element={<TableStructure />} />
              <Route exact path="operations" element={<TableOperations />} />
            </Route>
            
          </Route>

        </Route>
        
        <Route exact path="servers" element={<Servers />} />        
        <Route index path="*" element={<h2>WhereTF have you gone?!</h2>} />
      </Route>
    </Routes>
  );
}

export default App;

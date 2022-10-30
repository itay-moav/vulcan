import {createSlice,createAsyncThunk} from "@reduxjs/toolkit";
import { LoadStatus } from "../services/enums";
import http from "../services/http";
import {ENVIRONMENT__DBCONNECTIONS__CONNECTION_NAME,URL_PARAMS__DATABASE_NAME} from "../services/CONSTANTS";


// ---------------------------------------------------------------- API --------------------------------------------------------------
//Dispatches a query to the server
export const runQuery = createAsyncThunk('query/run', async ({connectionName,currentDatabase,query}) => {
  const {data} = await http.post(`/query/run/${ENVIRONMENT__DBCONNECTIONS__CONNECTION_NAME}/${connectionName}/${URL_PARAMS__DATABASE_NAME}/${currentDatabase}`,{params:{query}});
  return data.payload;
});

// ---------------------------------------------------------------- EOF API ----------------------------------------------------------

const initialState = {
  queryStatus: LoadStatus.IDLE,
  lastQuery:'',
  lastResults: [],
  lastError: '',
  lastPage:0,
  pageSize:500
};

const Query = createSlice({
  name: "query",
  initialState,
  reducers: {},
  //handlers/reducers for the query Thunk
  extraReducers(builder) {
    builder
      //server tree
      .addCase(runQuery.pending, (state) => {
        state.queryStatus = LoadStatus.LOADING
      })
      .addCase(runQuery.fulfilled, (state, action) => {
        state.queryStatus = LoadStatus.SUCCEEDED;
        console.log('kkkkkk',action.payload);
        state.lastQuery = action.payload.query;
        state.lastResults = action.payload.queryResult;
      })
      .addCase(runQuery.rejected, (state, action) => {
        state.queryStatus = LoadStatus.FAILED;
        state.lastError='';
        if(action.payload.queryResult ==='error'){
          state.lastResults = [];
          state.lastError = action.payload.error;
        } else {
          state.lastResults = action.payload.queryResult;
        }
      })
  }
});

export default Query.reducer;
export const QueryActions = {...Query.actions};
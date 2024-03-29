import {useSelector} from 'react-redux';
import { Table,Alert } from "react-bootstrap";

const QueryResults = ({noResults}) => {
    //TODO create as a selector function in the proper place
    const results = useSelector(state => (state.query.lastResults) );
    const errorMessage  = useSelector(state => (state.query.lastError) );
    
    //Server error handler
    if(errorMessage.length > 3){
        return (
                <Alert variant="danger">
                    <Alert.Heading>SQL Server error!</Alert.Heading>
                    <pre>{errorMessage}</pre>
                </Alert>
            );
    }

    //How to handle no resuts found
    if(results.length === 0){
        if(noResults && noResults==="hide"){
            return null;
        } else {   
            return (
                <Alert variant="warning">No results</Alert>
            );
        }
    }
    
    const keys = Object.keys(results[0]);
    let i = 0;

    return (  
        <Table responsive striped bordered hover size="sm" variant="dark">
            <thead>
                <tr>
                {keys.map( key=>(<th key={key}>{key}</th>) )}
                </tr>
            </thead>
            <tbody>
                {
                    results.map(row=>{
                                    i++;
                                    return (<tr key={i}>{keys.map(
                                        columnKey => {
                                            return (
                                                <td key={columnKey}>{row[columnKey]}</td>
                                            )
                                        }
                                    )}</tr>);
                                }
                    )
                }
            </tbody>
        </Table>
    );
}
 
export default QueryResults;

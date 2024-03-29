import { Row,Col } from "react-bootstrap";
import { Route,Routes, useNavigate, useParams } from "react-router-dom";
export default function ActionsRibon(){
    return (
        
        <Row className="pl-3">
        <Col>
        <Routes>
            <Route path="/servers/:server/databases/:database/schema/:schema/tables/:table/:link" element={<SingleTableRibon />} />
            <Route path="/servers/:server/databases/:database/schema/:schema/:link" element={<DatabaseTablesRibon />} /> 
            <Route path="/servers/:server/databases/:database/:link" element={<DatabaseTablesRibon />} />
        </Routes>
        </Col>
      </Row>

    );
}



function DatabaseTablesRibon(){
    const currentLink = useParams().link;
    return (
        <ul className="nav nav-tabs">
        <RibbonNav currentLink={currentLink} link="tables" text="Tables" />
        <RibbonNav currentLink={currentLink} link="sql" text="SQL" />
    </ul>
    );
}



function SingleTableRibon(){
    const currentLink = useParams().link;
    return (
        <ul className="nav nav-tabs">
            <RibbonNav currentLink={currentLink} link="browse" text="Browse" />
            <RibbonNav currentLink={currentLink} link="search" text="Search" />
            <RibbonNav currentLink={currentLink} link="insert" text="Insert" />
            <RibbonNav currentLink={currentLink} link="sql" text="SQL" />
            <RibbonNav currentLink={currentLink} link="structure" text="Structure" />
            <RibbonNav currentLink={currentLink} link="createsql" text="CreateSQL" />
            <RibbonNav currentLink={currentLink} link="operations" text="Operations" />
        </ul>
    );
}

function RibbonNav({currentLink,link,text}){
    const navigate = useNavigate();
    return (
        <li className="nav-item">
            {(link===currentLink) ? 
                     // eslint-disable-next-line
                    (<a className="nav-link active" href="#">{text}</a>) : 
                    (<a className="nav-link" href={`../${link}`} onClick={()=>{
                        navigate("./../"+link);
                    }}>{text}</a>)}
        </li>
    );
}

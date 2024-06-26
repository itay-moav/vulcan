import { Outlet } from "react-router-dom";
import { Container,Row,Col } from "react-bootstrap";
import UpArrow from "./upArrow";
import BreadCrumbs from "./breadCrumbs";
import DbTableMenu from "./dbTableMenu";
import SystemErrorModal from "./systemErrorModal";
import ActionsRibon from "./actionsRibon";
import ErrorBoundary from "../atoms/errorBoundary";
import './layout.css';

export default function Layout(){
  
	return (
    <>
      <Container fluid>
        <Row className="mt-1">
          <Col md={3}>
            <Row>
              <Col>
                <h3 className="mb-0 pb-0" style={{cursor:"pointer",color:"red",fontFamily:"Marker Felt, fantasy"}} onClick={()=>window.location.href="/vulcan"}>VULCAN <small style={{fontSize:"0.4em"}}>v{`${process.env.REACT_APP_VERSION}`}</small></h3>
                <small style={{fontSize:"0.6em"}}>Powered by <a href="https://github.com/itay-moav/TalisMS">TalisMS</a> and ReactJS</small>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col>
                <DbTableMenu />
              </Col>
            </Row>
          </Col>

          <Col md={9}>
          <Row className="mb-3">
            <Col>
              <BreadCrumbs />
            </Col>
          </Row>
          <ErrorBoundary>
          <ActionsRibon />
          </ErrorBoundary>
          
          <Row>
            <Col>
            <SystemErrorModal />
            </Col>
          </Row>

          <Row>
            <Col><ErrorBoundary><Outlet /></ErrorBoundary></Col>
          </Row>

          </Col>
        </Row>
      </Container>
      <UpArrow />
      </>
	);
}

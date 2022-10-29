import { Outlet } from "react-router-dom";
import { Container,Row,Col } from "react-bootstrap";
import UpArrow from "./upArrow";
import BreadCrumbs from "./breadCrumbs";
import DbTableMenu from "./dbTableMenu";
import './layout.css';


export default function Layout(){
  
	return (
    <>
      <Container fluid>
        <Row>
          <Col md={2}>
            <Row>
              <Col>
                <h3>phpSqlServAdmin</h3>
                <small>Powered by TalisMS and ReactJS</small>
              </Col>
            </Row>
            <Row>
              <Col>
                <DbTableMenu />
              </Col>
            </Row>
          </Col>

          <Col md={10}>
          <Row>
            <Col>
              <BreadCrumbs />
            </Col>
          </Row>

          <Row>
            <Col><Outlet /></Col>
          </Row>

          </Col>
        </Row>
      </Container>
      <UpArrow />
      </>
	);
}
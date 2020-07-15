import React, { useState, useEffect } from "react";
import "./App.css";
import { Container, Row, Col, Card } from "react-bootstrap";
import { Search } from "./components/search";
import { Results } from "./components/search-results";
import { ActiveDownloads } from "./components/active-downloads";

function App() {
  const [results, setResults] = useState([]);

  return (
    <div className="App">
      <Container fluid>
        <Row>
          <Col>
            <Search refresh={(r) => setResults(r)} test="bbb" />
          </Col>
        </Row>
        <Row>
          <Col xs={10}>
            <Results results={results} />
          </Col>
          <Col xs={2}>
            <ActiveDownloads />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
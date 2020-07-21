import React, { useState, useEffect } from "react";
import "./App.css";
import { Container, Row, Col, Card, Spinner } from "react-bootstrap";
import { Search } from "./components/search";
import { Results } from "./components/search-results";
import { ActiveDownloads } from "./components/active-downloads";

function App() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  return (
    <div className="App">
      <Container fluid>
        <Row>
          <Search
            refresh={(r) => {
              setResults(r);
              setLoading(false);
            }}
            loading={() => setLoading(true)}
          />
        </Row>
        <Row>
          <Col xs={10}>
            {loading ? (
              <Spinner style={{ margin: "5rem" }} animation="border" />
            ) : (
              <Results results={results} />
            )}
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

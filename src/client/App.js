import React, { useState } from "react";
import "./App.css";
import { Container, Row, Col, Spinner, Button } from "react-bootstrap";
import { Search } from "./components/search";
import { Results } from "./components/search-results";
import { ActiveDownloads } from "./components/active-downloads";
import { useMediaQuery } from 'react-responsive'


function App() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [resultsClosed, setResultsClosed] = useState(false);

  const isDesktopOrLaptop = useMediaQuery({
    query: '(min-width: 1224px)'
  })
  const isBigScreen = useMediaQuery({ query: '(min-width: 1824px)' })
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })
  const isPortrait = useMediaQuery({ query: '(orientation: portrait)' })
  const isRetina = useMediaQuery({ query: '(min-resolution: 2dppx)' })


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
          {isTabletOrMobile ? 
            <>
              {loading ? (
                  <Spinner style={{ margin: "5rem" }} animation="border" />
                ) : (
                  <Container>
                    <Row>
                      <Col></Col>
                      <Col></Col>
                      <Col>
                        <Button 
                            variant="outline-danger" 
                            onClick={()=>setResultsClosed(!resultsClosed)}>
                          {resultsClosed ? "ᐯ":"ᐱ"}
                        </Button>
                      </Col>
                    </Row>
                    {resultsClosed ?
                      null
                    :
                      <Row>
                        <Results results={results} />
                      </Row>
                    }
                  </Container>
                )}
              <ActiveDownloads />
            </>
            :
            <>
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
            </>
          }
        </Row>
      </Container>
    </div>
  );
}

export default App;

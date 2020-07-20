import React, { useRef } from "react";
import { Container, Row, Card } from "react-bootstrap";
// import { ITEMS_IN_ROW } from "../commons/constants";
const cfg = require("../../commons/config.json").client;

export function Results(props) {
  const refs = useRef(true);

  function firstRender() {
    if (refs.current) {
      refs.current = false;
      return true;
    }
    return false;
  }

  async function downloadTorrent(magnet) {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      const res = await fetch("/download", {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify({ magnet: magnet }),
      });
      if (res.ok) {
        alert("started download");
      } else {
        console.error("cant start download!");
      }
    } catch (error) {
      console.error(error);
    }
  }

  let i = 0;
  const grid = (cont) => {
    if (i++ % cfg.ITEMS_IN_ROW === 0) {
      return <Row>{cont}</Row>;
    } else {
      return cont;
    }
  };

  const listItems = props.results?.map((res) => (
    <Row>
      <Card style={{ width: "18rem" }}>
        <Card.Body>
          <Card.Title>{res.title}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">
            {res.size} {res.seeds}s/{res.peers}p
          </Card.Subtitle>
          <Card.Text>N/a</Card.Text>
          <Card.Link onClick={() => downloadTorrent(res.magnetLink)}>
            Download
          </Card.Link>
        </Card.Body>
      </Card>
    </Row>
  ));

  return (
    <Container fluid>
      {listItems?.length > 0
        ? grid(listItems)
        : firstRender()
        ? ""
        : "No results found!"}
    </Container>
  );
}

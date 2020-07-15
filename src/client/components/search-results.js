import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
// import { ITEMS_IN_ROW } from "../commons/constants";
const cfg = require("../../commons/config.json").client

export function Results(props) {
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
    if (i++ % (cfg.ITEMS_IN_ROW) === 0) {
      return <Row>{cont}</Row>;
    } else {
      return cont;
    }
  };

  const listItems = props.results.map((res) => (
    <Row>
      <Card style={{ width: "18rem" }}>
        <Card.Body>
          <Card.Title>{res.title}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">
            {res.size} {res.seeds}/{res.peers}
          </Card.Subtitle>
          <Card.Text>
            N/a
          </Card.Text>
          <Card.Link onClick={() => downloadTorrent(res.magnet)}>
            Download
          </Card.Link>
        </Card.Body>
      </Card>
    </Row>
  ));

  return <Container fluid>{grid(listItems)}</Container>;
}

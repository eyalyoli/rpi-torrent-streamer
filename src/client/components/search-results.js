import React, { useRef, useState } from "react";
import { Container, Row, Card, Modal, Button } from "react-bootstrap";
// import { ITEMS_IN_ROW } from "../commons/constants";
const cfg = require("../../commons/config.json").client;

export function Results(props) {
  const refs = useRef(true);
  const [show, setShow] = useState(false);
  const [msg, setMsg] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = (msg) => {
    setShow(true);
    setMsg(msg);
  };

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
        handleShow(
          "Download started... You can stream it from the active downloads"
        );
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
      <Card className="search-card" style={{ width: "18rem" }}>
        <Card.Body>
          <Card.Title>{res.title}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">
            {res.size} {res.seeds}s/{res.peers}p
          </Card.Subtitle>
          <Card.Text>N/a</Card.Text>
          <Card.Link
            onClick={() => downloadTorrent(res.magnetLink)}
            class="btn btn-secondary btn-lg"
            style={{ color: "white" }}
          >
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
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{msg}</Modal.Title>
        </Modal.Header>
        {/* <Modal.Body>{msg}</Modal.Body> */}
        <Modal.Footer>
          <Button variant="secondary" size="lg" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

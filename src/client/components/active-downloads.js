import React, { useState, useEffect } from "react";
import { Container, Card, Modal, Button } from "react-bootstrap";
const cfg = require("../../commons/config.json").client;

export function ActiveDownloads(props) {
  const [downloads, setDownloads] = useState([]);
  const [show, setShow] = useState(false);
  const [msg, setMsg] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = (msg) => {
    setShow(true);
    setMsg(msg);
  };

  useEffect(() => {
    get();
    setInterval(() => {
      get();
    }, cfg.REFRESH_INTERVALS);
  }, []);

  async function streamTorrent(hash) {
    try {
      const res = await fetch(`/stream/${hash}`);
      if (res.ok) {
        handleShow("Stream has began");
      } else {
        console.error("cannot start stream!");
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function removeTorrent(hash) {
    try {
      const res = await fetch(`/remove/${hash}`);
      if (res.ok) {
        handleShow("Torrent removed");
      } else {
        console.error("cannot remove torrent!");
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function get() {
    try {
      const res = await fetch("/downloading");
      if (res.ok) {
        const json = await res.json();
        setDownloads(json);
      } else {
        console.error("cant get active downloads!");
      }
    } catch (error) {
      console.error(error);
    }
  }

  const listItems = downloads.map((res) => {
    const list = () => {
      const dlPercent = Math.min(
        Math.round((res.downloaded / res.size) * 100),
        100
      );
      let dlSpeed = res.dlspeed / 1000000;
      if (dlSpeed < 1) dlSpeed = Math.round(dlSpeed * 1000) + " Kb/s";
      else dlSpeed = Math.round(dlSpeed) + " Mb/s";

      return (
        <Card style={{ width: "18rem" }} key={res.hash}>
          <Card.Body>
            <Card.Title>{res.name}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">
              {dlPercent}% @{" " + dlSpeed}
            </Card.Subtitle>
            <Card.Text>
              {dlPercent >= cfg.TORRENT_READY_TO_STREAM_THRESHOLD ? (
                <p style={{ color: "green" }}>Ready!</p>
              ) : (
                <p style={{ color: "red" }}>Buffering...</p>
              )}
            </Card.Text>
            <Card.Link
              onClick={() =>
                dlPercent >= cfg.TORRENT_READY_TO_STREAM_THRESHOLD
                  ? streamTorrent(res.hash)
                  : handleShow(
                      "Still buffering... Torrent is not ready to stream"
                    )
              }
            >
              Stream
            </Card.Link>
            <Card.Link onClick={() => removeTorrent(res.hash)}>
              Remove
            </Card.Link>
          </Card.Body>
        </Card>
      );
    };

    return list();
  });

  return (
    <Container>
      <p>Active downloads</p>
      {listItems}
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

import React, { useState, useEffect } from "react";
import { Container, Card, Modal, Button } from "react-bootstrap";
const cfg = require("../../commons/config.json").client;

export function ActiveDownloads(props) {
  const [downloads, setDownloads] = useState([]);
  const [show, setShow] = useState(false);
  const [msg, setMsg] = useState("");
  const [yesNo, setYesNo] = useState(false);

  const handleClose = () => {
    setShow(false);
    setYesNo(false);
  };
  const handleShow = (msg, yesNo = false) => {
    setYesNo(yesNo);
    setMsg(msg);
    setShow(true);
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

  const [yesFunc, setYesFunc] = useState(null);
  function removeTorrent(hash) {
    setYesFunc({
      func: async () => {
        try {
          setShow(false);
          setYesNo(false);
          const res = await fetch(`/remove/${hash}`);
          if (res.ok) {
            handleShow("Torrent removed");
          } else {
            console.error("cannot remove torrent!");
          }
        } catch (error) {
          console.error(error);
        }
      },
    });
    handleShow("Are you sure?", true);
  }

  async function get() {
    try {
      const res = await fetch("/downloading");
      if (res.ok) {
        const json = await res.json();
        console.log(json)
        setDownloads(json.torrents);
      } else {
        console.error("cant get active downloads!");
      }
    } catch (error) {
      console.error(error);
    }
  }

  const listItems = downloads.map((res) => {
    const list = () => {
      const dlPercent = Math.round(res.percentDone * 100);
      let dlSpeed = res.rateDownload / 1000000;
      if (dlSpeed < 1) dlSpeed = Math.round(dlSpeed * 1000) + " Kb/s";
      else dlSpeed = Math.round(dlSpeed) + " Mb/s";

      return (
        <Card
          className="activedown-card"
          style={{ width: "18rem" }}
          key={res.hash}
        >
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
              class="btn btn-secondary btn-lg"
              style={{ color: "white" }}
              onClick={() =>
                dlPercent >= cfg.TORRENT_READY_TO_STREAM_THRESHOLD
                  ? streamTorrent(res.hashString)
                  : handleShow(
                      "Still buffering... Torrent is not ready to stream"
                    )
              }
            >
              Stream
            </Card.Link>
            <Card.Link
              class="btn btn-danger btn-lg"
              style={{ color: "white" }}
              onClick={() => removeTorrent(res.hashString)}
            >
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
      <p class="h5">Active downloads</p>
      {listItems}
      <Modal
        show={show}
        onHide={handleClose}
        backdrop={yesNo ? "static" : true}
      >
        <Modal.Header closeButton>
          <Modal.Title>{msg}</Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          {yesNo ? (
            <>
              <Button variant="danger" size="lg" onClick={yesFunc.func}>
                Yes
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => {
                  setShow(false);
                  setMsg(null);
                  setYesNo(false);
                }}
              >
                No
              </Button>
            </>
          ) : (
            <Button variant="secondary" size="lg" onClick={handleClose}>
              Close
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

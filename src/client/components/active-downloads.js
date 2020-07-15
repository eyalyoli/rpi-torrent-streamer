import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
const cfg = require("../../commons/config.json").client;

export function ActiveDownloads(props) {
  const [downloads, setDownloads] = useState([]);

  useEffect(() => {
    setInterval(() => {
      get();
    }, cfg.REFRESH_INTERVALS);
  }, []);

  async function streamTorrent(hash) {
    try {
      const res = await fetch(`/stream/${hash}`);
      if (res.ok) {
        alert("stream began");
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
        alert("torrent removed");
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

  let i = 0;
  const listItems = downloads.map((res) => {
    const list = () => {
      return (
        <Card style={{ width: "18rem" }} key={res.hash}>
          <Card.Body>
            <Card.Title>{res.name}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">
              Card Subtitle
            </Card.Subtitle>
            <Card.Text>
              Some quick example text to build on the card title and make up the
              bulk of the card's content.
            </Card.Text>
            <Card.Link onClick={() => streamTorrent(res.hash)}>
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

  return <Container>{listItems}</Container>;
}

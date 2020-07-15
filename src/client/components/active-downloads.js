import React, { useState, useEffect } from "react";
import { Container, Card } from "react-bootstrap";
const cfg = require("../../commons/config.json").client;

export function ActiveDownloads(props) {
  const [downloads, setDownloads] = useState([]);

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
            <Card.Text>N/a</Card.Text>
            <Card.Link
              onClick={() =>
                dlPercent >= cfg.TORRENT_READY_TO_STREAM_THRESHOLD
                  ? streamTorrent(res.hash)
                  : alert("still buffering... torrent is not ready to stream")
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

  return <Container>{listItems}</Container>;
}

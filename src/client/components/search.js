import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  ButtonGroup,
  ToggleButton,
  Button,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import { pad } from "../../commons/utils";
const cfg = require("../../commons/config.json");

export function Search(props) {
  const [query, setQuery] = useState("");
  const [isSeries, setIsSeries] = useState(false);
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);
  const [provider, setProvider] = useState(0);

  async function searchTorrent() {
    props.loading();
    const url =
      `/search/${provider}/${query}` +
      (isSeries ? ` s${pad(season, 2)}e${pad(episode, 2)}` : ``);

    try {
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        props.refresh(json);
      } else {
        console.error("http error while fetching search " + url);
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div style={{ display: "block ruby" }}>
      <InputGroup size="lg" style={{ width: "20rem" }}>
        <FormControl
          aria-label="Large"
          aria-describedby="inputGroup-sizing-sm"
          placeholder="Name a movie or series..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </InputGroup>

      <ButtonGroup toggle className="mb-2">
        <ToggleButton
          type="checkbox"
          variant="secondary"
          size="lg"
          checked={isSeries}
          value="1"
          onChange={(e) => setIsSeries(e.currentTarget.checked)}
        >
          Series
        </ToggleButton>
      </ButtonGroup>
      <div style={{ display: isSeries ? "initial" : "none" }}>
        <InputGroup size="lg" style={{ width: "15rem" }}>
          <InputGroup.Prepend>
            <InputGroup.Text id="inputGroup-sizing-lg">s</InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl
            aria-label="Large"
            aria-describedby="inputGroup-sizing-sm"
            value={season}
            onChange={(e) => setSeason(e.target.value)}
          />
          <InputGroup.Append>
            <Button
              variant="outline-secondary"
              onClick={() => setSeason(season + 1)}
            >
              +
            </Button>
            <Button
              variant="outline-secondary"
              onClick={() => setSeason(season - 1)}
            >
              -
            </Button>
          </InputGroup.Append>
        </InputGroup>
        <InputGroup size="lg" style={{ width: "15rem" }}>
          <InputGroup.Prepend>
            <InputGroup.Text id="inputGroup-sizing-lg">e</InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl
            aria-label="Large"
            aria-describedby="inputGroup-sizing-sm"
            value={episode}
            onChange={(e) => setEpisode(e.target.value)}
          />
          <InputGroup.Append>
            <Button
              variant="outline-secondary"
              onClick={() => setEpisode(episode + 1)}
            >
              +
            </Button>
            <Button
              variant="outline-secondary"
              onClick={() => setEpisode(episode - 1)}
            >
              -
            </Button>
          </InputGroup.Append>
        </InputGroup>
      </div>
      <InputGroup size="lg" style={{ width: "20rem" }}>
        <InputGroup.Prepend>
          <InputGroup.Text id="inputGroup-sizing-lg">From</InputGroup.Text>
        </InputGroup.Prepend>
        <FormControl
          aria-label="Large"
          aria-describedby="inputGroup-sizing-sm"
          value={cfg.common.ALL_PROVIDERS[provider]}
          onChange={(e) => setProvider(e.target.value)}
        />
        <InputGroup.Append>
          <Button
            variant="outline-secondary"
            onClick={() => setProvider(provider + 1)}
          >
            +
          </Button>
          <Button
            variant="outline-secondary"
            onClick={() => setProvider(provider - 1)}
          >
            -
          </Button>
        </InputGroup.Append>
      </InputGroup>
      <Button variant="primary" size="lg" onClick={searchTorrent}>
        Search
      </Button>
    </div>
  );
}

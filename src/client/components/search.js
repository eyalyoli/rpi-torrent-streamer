import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { pad } from "../../commons/utils";

export function Search(props) {
  const [query, setQuery] = useState("");
  const [isSeries, setIsSeries] = useState(false);
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);
  const [provider, setProvider] = useState(0);

  async function searchTorrent() {
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
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Name a movie or series..."
      />
      <label>Series</label>
      <input
        type="checkbox"
        value={isSeries}
        onChange={(e) => setIsSeries(e.target.value)}
      />
      <div style={{ display: isSeries ? "initial" : "none" }}>
        <input
          type="number"
          placeholder="Season"
          value={season}
          onChange={(e) => setSeason(e.target.value)}
        />
        <input
          type="number"
          placeholder="Episode"
          value={episode}
          onChange={(e) => setEpisode(e.target.value)}
        />
      </div>
      <input
        type="number"
        placeholder="Provider"
        value={provider}
        onChange={(e) => setProvider(e.target.value)}
      />
      <button onClick={searchTorrent}>Search</button>
    </div>
  );
}

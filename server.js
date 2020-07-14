const TorrentSearchApi = require("torrent-search-api");
const cp = require("child_process");
const tc = require("./torrent-client");

const SEARCH_LIMIT = 20;
const ALL_PROVIDERS = [
  "ThePirateBay",
  "1337x",
  "Rarbg",
  "Eztv",
  "Yts",
  "KickassTorrents",
];

TorrentSearchApi.enablePublicProviders();

//console.log(TorrentSearchApi.getProviders());

var express = require("express");
var app = express();

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// respond with "hello world" when a GET request is made to the homepage
app.get("/", async function(req, res) {
  res.send("hello");
});

app.get("/search/:provider/:query", async function(req, res) {
  console.log(req.params);
  const r = await search(ALL_PROVIDERS[req.params.provider], req.params.query);
  console.log(await getHash(r[0]));
  res.send(r);
});

app.post("/download", async function(req, res) {
  console.log("download=" + JSON.stringify(req.body));
  r = await tc.addTorrent(req.body.magnet, (err) => {
    if (err) res.status(500).send("error");
    else res.send("OK");
  });
});

app.get("/remove/:hash", async function(req, res) {
  console.log("download=" + JSON.stringify(req.params.hash));
  r = await tc.removeTorrent(req.params.hash, (err) => {
    if (err) res.status(500).send("error");
    else res.send("OK");
  });
});

let currentTorrents = [];
app.get("/downloading", function(req, res) {
  updateCurrentTorrentsList((ts) => {
    currentTorrents = ts;
    res.json(ts);
  });
});

const PLAYER_CMD = "vlc";
const TORRENT_READY_TO_STREAM_THRESHOLD = 0.1;

app.get("/stream/:hash", async function(req, res) {
  const hash = req.params.hash;
  console.log("stream=" + JSON.stringify(hash));

  //check if downloading
  const t = findTorrent(hash, currentTorrents);
  if (t) {
    await tc.getTorrentPath(hash, async (err, result) => {
      if (err) res.status(500).send("error");
      const percent = t.downloaded / t.size;
      console.log("finished=" + percent);
      if (percent > TORRENT_READY_TO_STREAM_THRESHOLD) {
        const playerProc = await cp.exec(PLAYER_CMD + ' "' + result.path + '"');
        console.log("running player at " + playerProc.pid);
        res.send("OK");
      } else
        res
          .status(500)
          .send("torrent is not ready to stream. buffering... try again later");
    });
  } else {
    res
      .status(404)
      .send("torrent was not found. please download it before you stream.");
  }
});

const TORRENT_CLIENT_CMD = "qbittorrent";
let tcProc;
async function runTorrentClient() {
  tcProc = await cp.exec(TORRENT_CLIENT_CMD);
  console.log("torrent client is running " + tcProc.pid);
}

const TORRENT_REFRESH_RATE = 5000;

function updateCurrentTorrentsList(cb) {
  tc.getAllTorrents((err, ts) => {
    if (err) throw err;
    if (ts)
      console.log(
        "current torrents list updated with " + ts.length + " entries"
      );
    cb(ts);
  });
}

function findTorrent(hash, list) {
  let res = undefined;
  list.forEach((t) => {
    console.log(t.hash, hash);
    if (t.hash === hash) {
      console.log("got");
      res = t;
    }
  });
  return res;
}

//Setting up server
var server = app.listen(process.env.PORT || 5050, async function() {
  var port = server.address().port;
  console.log("App now running on port", port);
  await runTorrentClient();

  // await updateCurrentTorrentsList();
  // setInterval(() => {
  //   updateCurrentTorrentsList();
  // }, TORRENT_REFRESH_RATE);
});

async function search(provider, query) {
  return await TorrentSearchApi.search([provider], query, "All", SEARCH_LIMIT);
}

async function getHash(torrent) {
  const magnet = TorrentSearchApi.getMagnet(torrent);
  return (await magnet).match(/xt=[a-zA-Z:]+([0-9A-Za-z]+)/)[1];
}

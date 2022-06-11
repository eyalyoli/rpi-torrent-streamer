const cfg = require("../commons/config");
const cp = require("child_process");
const tc = require("./torrent-client");
const path = require("path");
const {
  runTorrentClient,
  getActiveTorrentsList,
  findTorrent,
  search,
} = require("./torrents-utils");

// >>>>>>>>>>>>>>>>> Server init >>>>>>>>>>>>>>>>>
var express = require("express");

var app = express();

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

//Setting up server
var server = app.listen(process.env.SERVER_PORT || 5050, async function() {
  var port = server.address().port;
  console.log("App now running on port", port);
  await runTorrentClient();
});
// <<<<<<<<<<<<<<<<< Server init <<<<<<<<<<<<<<<<<

// >>>>>>>>>>>>>>>>> Routing >>>>>>>>>>>>>>>>>
react_build = process.env.PUBLIC_PATH || path.join(__dirname, "..", "..", "build")

app.use(express.static(react_build))

app.get("/", async function(req, res){
  res.sendFile(path.join(react_build, "index.html"));
})

app.get("/search/:provider/:query", async function(req, res) {
  console.log(req.params);
  console.log("req provider", cfg.common.ALL_PROVIDERS[req.params.provider]);
  const r = await search(
    cfg.common.ALL_PROVIDERS[req.params.provider],
    req.params.query
  );
  res.send(r);
});

app.post("/download", async function(req, res) {
  console.log("download=" + JSON.stringify(req.body));
  await tc.addTorrent(req.body.magnet, (err) => {
    if (err) res.status(500).send("error");
    else res.send("OK");
  });
});

app.get("/remove/:hash", async function(req, res) {
  console.log("download=" + JSON.stringify(req.params.hash));
  await tc.removeTorrent(req.params.hash, (err) => {
    if (err) res.status(500).send("error");
    else res.send("OK");
  });
});

let currentTorrents = [];
app.get("/downloading", function(req, res) {
  getActiveTorrentsList((ts) => {
    currentTorrents = ts;
    res.json(ts);
  });
});

var playerProc = null
app.get("/stream/:hash", async function(req, res) {
  const hash = req.params.hash;
  console.log("stream=" + JSON.stringify(hash));

  if(playerProc && !playerProc.killed){
    res.status(400).send("a player is already streaming...");
  }

  await tc.getTorrentPath(hash, async (err, result) => {
    console.log(err, result)
    if (err) res.status(400).send("error");
    playerProc = await cp.exec(
      cfg.server.PLAYER_CMD + ' "' + result.path + '"'
    );
    console.log("running player at " + playerProc.pid);
    res.send("OK");
  });
});

app.get("/streamkill", async function(req, res){
  console.log('killing player...')
  playerProc.kill('SIGINT')
  res.send('OK')
})
// <<<<<<<<<<<<<<<<< Routing <<<<<<<<<<<<<<<<<

const cfg = require("../commons/config");
const cp = require("child_process");
const tc = require("./torrent-client");
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
var server = app.listen(process.env.PORT || 5050, async function() {
  var port = server.address().port;
  console.log("App now running on port", port);
  await runTorrentClient();
});
// <<<<<<<<<<<<<<<<< Server init <<<<<<<<<<<<<<<<<

// >>>>>>>>>>>>>>>>> Routing >>>>>>>>>>>>>>>>>
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

  if(!playerProc.killed){
    res.status(400).send("a player is already streaming...");
  }

  //check if downloading
  const t = findTorrent(hash, currentTorrents);
  if (t) {
    await tc.getTorrentPath(hash, async (err, result) => {
      if (err) res.status(400).send("error");
      playerProc = await cp.exec(
        cfg.server.PLAYER_CMD + ' "' + result.path + '"'
      );
      console.log("running player at " + playerProc.pid);
      res.send("OK");
    });
  } else {
    res
      .status(404)
      .send("torrent was not found. please download it before you stream.");
  }
});

app.get("/streamkill", async function(req, res){
  console.log('killing player...')
  playerProc.kill('SIGINT')
  res.send('OK')
})
// <<<<<<<<<<<<<<<<< Routing <<<<<<<<<<<<<<<<<

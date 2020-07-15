const TorrentSearchApi = require("torrent-search-api");
const cfg = require("../commons/config").server;
const cp = require("child_process");

TorrentSearchApi.enablePublicProviders();
//console.log(TorrentSearchApi.getProviders());

let tcProc;
export async function runTorrentClient() {
  console.log(JSON.stringify(cfg));
  tcProc = await cp.exec(cfg.TORRENT_CLIENT_CMD);
  console.log("torrent client is running " + tcProc.pid);
}

export function getActiveTorrentsList(cb) {
  tc.getAllTorrents((err, ts) => {
    if (err) throw err;
    if (ts)
      console.log(
        "current torrents list updated with " + ts.length + " entries"
      );
    cb(ts);
  });
}

export function findTorrent(hash, list) {
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

export async function search(provider, query) {
  return await TorrentSearchApi.search(
    [provider],
    query,
    "All",
    cfg.SEARCH_LIMIT
  );
}

export async function getHash(torrent) {
  const magnet = TorrentSearchApi.getMagnet(torrent);
  return (await magnet).match(/xt=[a-zA-Z:]+([0-9A-Za-z]+)/)[1];
}
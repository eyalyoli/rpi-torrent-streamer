const TorrentSearchApi = require("torrent-search-api");
const cfg = require("./config.json").server;
const cp = require("child_process");
const tc = require("./torrent-client");

TorrentSearchApi.enablePublicProviders();
//console.log(TorrentSearchApi.getProviders());

let tcProc;
exports.runTorrentClient = async () => {
  console.log(JSON.stringify(cfg));
  tcProc = await cp.exec(cfg.TORRENT_CLIENT_CMD);
  console.log("torrent client is running " + tcProc.pid);
};

// exports.findTorrent = (hash, list) => {
//   let res = undefined;
//   list.forEach((t) => {
//     console.log(t.hash, hash);
//     if (t.hash === hash) {
//       console.log("got");
//       res = t;
//     }
//   });
//   return res;
// };

exports.search = async (provider, query) => {
  const res = await TorrentSearchApi.search(
    [provider],
    query,
    "All",
    cfg.SEARCH_LIMIT
  );

  return await Promise.all(
    res.map(async (t) => {
      const m = await TorrentSearchApi.getMagnet(t);
      t.magnetLink = m;
      return t;
    })
  );
};

exports.getHash = async (torrent) => {
  const magnet = TorrentSearchApi.getMagnet(torrent);
  return (await magnet).match(/xt=[a-zA-Z:]+([0-9A-Za-z]+)/)[1];
};

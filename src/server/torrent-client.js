Transmission = require('transmission')
const path = require("path");
const cfg = require("../server/config.json").server;

transmission = new Transmission({  
  host: 'localhost',
  port: cfg.TORRENT_PORT,
  username: cfg.TORRENT_USER,
  password: cfg.TORRENT_PASSWORD
})

exports.addTorrent = (magnet,cb) => {
  console.log('magnet', magnet)
  transmission.addUrl(magnet, cb)
};

exports.getAllTorrents =  (cb) => {
  transmission.get(cb)
};

//TODO need to change magnet to id
exports.removeTorrent = (magnet,cb) => {
  transmission.remove(magnet, true, cb)
};

exports.getTorrentPath = (magnet,cb) => {
  transmission.get(magnet, function(err, torrent){
    if (err) cb(err)

    max_file_size = 0
    max_file_name = null
    for (file in torrent.files){
        if (file.length > max_file_size)
          max_file_name = file.name
    }

    cb(null, path.join(torrent.downloadDir, torrent.name, max_file_name))
  })
};

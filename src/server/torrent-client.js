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

exports.removeTorrent = (id, cb) => {
  transmission.remove(id, true, cb)
};

exports.getTorrentPath = (id, cb) => {
  transmission.get(id, function(err, torrents){
    console.log(torrents)
    if (err) cb(err)
    torrent = torrents.torrents[0]
    if(torrent) cb('failed to find torrent')

    max_file_size = 0
    max_file_name = null
    for (file of torrent.files){
      console.log(file)
        if (file.length > max_file_size)
          max_file_name = file.name
    }

    if (!max_file_name)
      cb('no files found in torrent')
    full_path=path.join(torrent.downloadDir, torrent.name, max_file_name)
    console.log(full_path)
    cb(null, full_path)
  })
};

const py = require("python-shell");
const { PY_SCRIPT_PATH } = require("./commons/constants");

exports.addTorrent = (magnet,cb) => {
  console.log('magnet',magnet)
  py.PythonShell.run(PY_SCRIPT_PATH, { args: ["add", magnet] }, function(
    err,
    results
  ) {
    console.log("results:", results);
    cb(err, results)
  });
};

exports.getAllTorrents =  (cb) => {
   py.PythonShell.run(PY_SCRIPT_PATH, { args: ["list"] }, function(
    err,
    results
  ) {
    // results is an array consisting of messages collected during execution
    //console.log("results: ", results);
    //console.log("results: ", JSON.parse(results));
    cb(err,JSON.parse(results))
  });
};

exports.removeTorrent = (magnet,cb) => {
  py.PythonShell.run(PY_SCRIPT_PATH, { args: ["remove", magnet] }, function(
    err,
    results
  ) {
    // results is an array consisting of messages collected during execution
    //console.log("results: %j", results);
    cb(err, JSON.parse(results))
  });
};

exports.getTorrentPath = (magnet,cb) => {
  py.PythonShell.run(PY_SCRIPT_PATH, { args: ["getpath", magnet] }, function(
    err,
    results
  ) {
    // results is an array consisting of messages collected during execution
    console.log("results: ", results);
    cb(err, JSON.parse(results))
  });
};

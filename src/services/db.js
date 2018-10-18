// [SERVICE] MongoDB wrapper
// ------------------------
// It handles the connection to mongo as well as
// returning the collections

var async = require('async');

// Requiring MongoDB dependencies
const MongoClient = require('mongodb').MongoClient;

// Variables to control the DB status
let db;
let connected = false;

function DB() {}

// **connect(url, dbName, callback)**
//
// - `url`: the mongod server url
// - `dbName`: the mongod database name
// - `callback`
//
// It creates a new connection to MongoDB and yields the `db`
// as well as stores it in the service
function connect(url, dbName, callback) {
  async.waterfall([
    next => MongoClient.connect(url, next),
    (result, next) => {
      db = result.db(dbName);
      connected = true;
      db.listCollections().toArray(next);
    }
  ], (err, result) => {
    if (err) {
      throw new Error('Could not connect: ' + err);
    }
    return callback(null, {
      db: db,
      collections: result
    });
  });
}

// **getCollection(name)**
//
// - `name`: the collection name
//
// Returns the collection indicated in the name parameter
//
// NOTE: exported as `collection(name)` instead of `getCollection(name)`
function getCollection(name) {
  if (!connected) {
    throw new Error('Must connect to Mongo before calling "collection"');
  }
  return db.collection(name);
}

DB.prototype.connect = connect;
DB.prototype.collection = getCollection;

module.exports = new DB();

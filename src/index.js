//
// NLP Workshop server
//
// Created by: Sopra Steria
//
// Sopra Steria © 2018
// All rights reserved

const express = require('express');
const Server = require('http').Server;
const expressSession = require('express-session');
const serveStatic = require('serve-static');

const config = require('config');
const compression = require('compression');
const bodyParser = require('body-parser');
const path = require('path');

const package = require(path.join(__dirname, '../package.json'));
//const mongo = require(path.join(__dirname, 'services/db'));
const logger = require(path.join(__dirname, 'services/logger'));

// Initializing the app
const app = express();
const server = new Server(app);

// Access-Control
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  //res.header('Access-Control-Allow-Credentials', true);
  //res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  return next();
});
// Parse stringified queries
app.use(function (req, res, next) {
  for (let key in req.query || {}) {
    if (typeof req.query[key] === 'string') {
      try {
        req.query[key] = JSON.parse(req.query[key]);
      } catch (e) {}
    }
  }
  return next();
});


// GZIP Compression
app.use(compression());
// X-Powered-By false
app.set('x-powered-by', false);
// BodyParser
app.use(bodyParser.urlencoded({
  extended: true,
  limit: '8mb'
}));
app.use(bodyParser.json({
  limit: '8mb'
}));
app.use(bodyParser.text());

// Router
/*
require(path.join(__dirname, 'routes/router'))(app);
*/

// Serving Webapp as static content
/*
app.use(serveStatic(path.resolve(config.get('webapp.url')), {
  setHeaders: function (res, path) {
    if (path.indexOf('index.html') === -1) {
      res.setHeader('Cache-Control', config.get('webapp.cacheControl'));
    }
  }
}));
*/

// Starting DB and Server
(function initializeServer() {
  let port = config.get('SERVER.PORT');
  server.listen(port, err => {
    if (err) {
      logger.error(err, 'Error starting NLP Server');
    } else {
      console.log('\n\n****************************************');
      console.log('****************************************');
      console.log(`      NLP Workshop Server v${package.version}`);
      console.log('----------------------------------------');
      console.log(`      Up and running on port ${port}`);
      console.log('----------------------------------------');
      console.log('****************************************\n\n');
      logger.info({
        port: port,
        version: package.version
      }, 'NLP Server Running');
    }
  });
})();
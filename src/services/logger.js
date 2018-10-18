// [SERVICE] Logger wrapper
// ------------------------
// It writes logs using buyan module

// Requiring logger dependencies
var bunyan = require('bunyan');
var config = require('config').get('logger');

var logger;
var options = {
  name: 'nlp-server',
  streams: [{
    level: config.console.level,
    stream: process.stdout
  }]
};

function Logger() {
  if (!logger) {
    if (config.file) {
      options.streams.push({
        level: config.file.level,
        path: config.file.path
      });
    }
    logger = bunyan.createLogger(options);
    extend(logger);
  }
  return logger;
}

// **extend(logger)**
//
// - `logger`: the logger created with bunyan
//
// It adds the custom methods to the default bunyan logger
function extend(logger) {
  logger.request = request;
}

// **request(req, level, message)**
//
// - `req`: the request object
// - `level`: the level of the log. Default to info
// - `message`: the log message
//
// It writes a log with the basic information of an express request
function request(req, level, message) {
  var logObject = {
    method: req.method,
    url: req.url,
    params: JSON.parse(JSON.stringify(req.params || {})),
    query: JSON.parse(JSON.stringify(req.query || {})),
    body: JSON.parse(JSON.stringify(req.body || {})),
    user: req.session.user && req.session.user._id
  };
  if (level === 'debug' || level === 'trace') {
    logObject.session = req.session;
  } else {
    if (logObject.body) {
      delete logObject.body.bt_signature;
      delete logObject.body.bt_payload;
      delete logObject.body.password;
    }
    if (logObject.params) {
      delete logObject.params.password;
    }
    if (logObject.query) {
      delete logObject.query.password;
    }
  }
  logger[level || 'info'](logObject, message || 'Request received');
}

module.exports = new Logger();
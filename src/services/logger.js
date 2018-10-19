// [SERVICE] Logger wrapper
// ------------------------
// It writes logs using buyan module

// Requiring logger dependencies
var bunyan = require('bunyan');
var CONFIG = require('config').LOGGER;

var logger;
var options = {
  name: 'nlp-server',
  streams: [{
    level: CONFIG.CONSOLE.LEVEL,
    stream: process.stdout
  }]
};

function Logger() {
  if (!logger) {
    if (CONFIG.FILE) {
      options.streams.push({
        level: CONFIG.FILE.LEVEL,
        path: CONFIG.FILE.PATH
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
    body: JSON.parse(JSON.stringify(req.body || {}))
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
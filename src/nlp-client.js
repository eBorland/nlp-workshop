const config = require('config');
const path = require('path');
const automl = require('@google-cloud/automl');
const scraper = require(path.join(__dirname, 'scraper'));
const logger = require(path.join(__dirname, 'services/logger'));
const ERROR_CODES = require(path.join(__dirname, 'constants/errors.json'));

const nlp = new automl.PredictionServiceClient(config.AUTOML.INIT);
const modelName = nlp.modelPath(...config.AUTOML.MODEL_PATH);

function predictText(content, callback) {
  logger.debug('Predicting Text: ', content);
  let request = {
    name: modelName,
    payload: {
      textSnippet: {
        content: content
      }
    }
  };
  nlp.predict(request)
    .then(response => {
      logger.debug('Predicted Text: ', response);
      let result = parseResponse(response);
      if (result.error) {
        return callback(result.error);
      }
      return callback(null, result);
    })
    .catch(err => {
      err.code = ERROR_CODES[err.code || 500];
      return callback(err);
    });
}

function predictUrl(url, options = {}, callback) {
  logger.debug('Predicting from url: ', url);
  scraper.getHtml(url, (err, html) => {
    if (err) return callback(err);
    let processed = scraper.processHtml(html, options);
    let request = {
      name: modelName,
      payload: {
        textSnippet: {
          content: processed.full
        }
      }
    };
    nlp.predict(request)
      .then(response => {
        logger.debug('Predicted from url: ', response);
        let result = parseResponse(response);
        if (result.error) {
          return callback(result.error);
        }
        return callback(null, result);
      })
      .catch(err => {
        err.code = ERROR_CODES[err.code || 500];
        return callback(err);
      });
  });
}

function parseResponse(response) {
  if (!response || !response[0]) {
    let error = new Error('No valid response');
    error.code = 400;
    return { error };
  }
  let payload = response[0].payload || [];
  let result = {
    score: payload[0].classification.score,
    type: payload[0].displayName
  };
  // Getting the higher score in case they didn't come already sorted
  payload.forEach(type => {
    if (type.classification.score > result.score) {
      result.score = type.classification.score;
      result.type = type.displayName;
    }
  });
  return result;
}

module.exports = {
  predictText,
  predictUrl
}
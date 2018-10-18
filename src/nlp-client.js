const config = require('config');
const path = require('path');
const automl = require('@google-cloud/automl');
const logger = require(path.join(__dirname, 'services/logger'));
const ERROR_CODES = require(path.join(__dirname, 'constants/errors.json'));

const nlp = new automl.PredictionServiceClient(config.AUTOML.INIT);
const modelName = nlp.modelPath(...config.AUTOML.MODEL_PATH);

const THRESHOLD = 0.5;

function predict(content, callback) {
  logger.debug('Predicting: ', content);
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
      logger.debug('Predicted: ', response);
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
  // Getting the higher score in case they don't arrive sorted
  payload.forEach(type => {
    if (type.classification.score > result.score) {
      result.score = type.classification.score;
      result.type = type.displayName;
    }
  });
  return result;
}

module.exports = {
  predict
}
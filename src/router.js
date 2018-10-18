const path = require('path');
const logger = require(path.join(__dirname, 'services/logger'));
const nlp = require(path.join(__dirname, 'nlp-client'));

/**
 * Router
 * It redirects each url to the proper function
 *
 * @param router [REQUIRED] Express.js application
 */
module.exports = function (router) {
  // Logging requests
  router.get('*', function (req, res, next) {
    logger.debug(req.method + ' Request received: ' + req.url);
    logger.request(req, 'trace');
    return next();
  });

  // Predict Text
  router.post('/predict/text', (req, res) => {
    logger.info('Starting text prediction');
    nlp.predictText(req.body.content, (err, result) => {
      if (err) {
        logger.error('Error predicting text', err);
        return res.sendStatus(err.code || 500);
      }
      logger.info('Prediction finished');
      return res.status(200).send(result);
    });
  });

  // Predict HTML url
  router.post('/predict/url', (req, res) => {
    logger.info('Starting url prediction');
    nlp.predictUrl(req.body.url, req.body.options, (err, result) => {
      if (err) {
        logger.error('Error predicting text', err);
        return res.sendStatus(err.code || 500);
      }
      logger.info('Prediction finished');
      return res.status(200).send(result);
    });
  });
};

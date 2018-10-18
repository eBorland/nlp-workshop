const scraper = require('./index.js')

// Cli usage arguments
const argv = require('yargs')
  .usage('Usage: $0 --url <url> ')
  .example('$0 --url https://www.bbc.com/news/science-environment-45856377', 'Scraping BBC news')
  .option('run', {
    alias: 'r',
    describe: 'Run your program',
    demandOption: false
  })
  .option('url', {
    alias: 'u',
    describe: 'Url to get the text from',
    demandOption: true
  })
  .option('h1', {
    describe: 'Selector for title',
    default: 'h1'
  })
  .option('h2', {
    describe: 'Selector for subtitle',
    default: 'h2'
  })
  .option('text', {
    alias: 't',
    describe: 'Selector for text',
    default: 'p'
  })
  .option('output', {
    alias: 'o',
    describe: 'Output file path'
  })
  .argv;

// Cli usage wrapper
(function run() {
  const url = argv.url;
  scraper.getHtml(url, (err, html) => {
    if (err) {
      return console.log('ERROR performing the request: ' + err.message, err);
    }
    scraper.processHtml(html, argv, true);
  });
})();
const fs = require('fs');
const http = require('http');
const https = require('https');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

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
  let request = https;
  if (!url.includes('https')) request = http;
  request.get(url, response => {
    let data = '';
    response.on('data', chunk => data += chunk);
    response.on('end', () => processHtml(data, argv));
  }).on('error', err => {
    console.log('ERROR performing the request: ' + err.message, err);
  });
})();

/**
 * getText(elements)
 * @param elements {HTMLNode[]} An array of HTMLNode elements to extract the text from
 *
 * @returns {String} A concatenated text from all elements
 */
function getText(elements) {
  let text = '';
  if (elements && elements.forEach) {
    elements.forEach(element => {
      text += (element.textContent || element.text || element.value || '').trim() + '\n';
    });
  }
  return text;
}

/**
 * processHtml(html, opts)
 *
 * @param html {String} The HTML string to process and extract title, subtitle and body
 * @param opts {Object} The options object
 * @param opts.h1 {String='h1'} The CSS Selector to find the title (default to 'h1')
 * @param opts.h2 {String='h2'} The CSS Selector to find the subtitle (default to 'h2')
 * @param opts.text {String='p'} The CSS Selector to find the body (default to 'p')
 * @param opts.output {String} When an output file is requried, it indicates the path to save it (ie: ./dataset/sports/sample1.txt) [Only recommended for cli usage]
 *
 * @return {Object} The title, subtitle, body and full texts extracted from the html
 *
 * TODO Feel free to improve and extend this function to achieve greater granurality
 */
function processHtml(html, opts) {
  // Loading full HTML
  let dom = new JSDOM(html);
  let document = dom.window.document;
  // Splitting text headings and paragraphs
  let text = {
    title: getText(document.querySelectorAll(opts.h1)),
    subtitle: getText(document.querySelectorAll(opts.h2)),
    body: getText(document.querySelectorAll(opts.text))
  };
  text.full = text.title + '\n' + text.subtitle + '\n' + text.body;
  // Writing output file (for sampling purposes)
  if (opts.output) {
    fs.writeFileSync(opts.output, text.full, 'utf8');
  }
  return text;
}

module.exports = {
  processHtml
};
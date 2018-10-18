const fs = require('fs');
const http = require('http');
const https = require('https');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

/**
 * getHtml(url, callback)
 * @param url {String} The http(s) url to get the html from
 * @param callback {Function}
 *
 * @returns err {Error}
 * @returns data {String} The HTML string
 */
function getHtml(url, callback) {
  let request = https;
  if (!url.includes('https')) request = http;
  request.get(url, response => {
    let data = '';
    response.on('data', chunk => data += chunk);
    response.on('end', () => callback(null, data));
  }).on('error', err => {
    console.log('ERROR performing the request: ' + err.message, err);
    return callback(err);
  });
}

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
 * processHtml(html, opts, print)
 *
 * @param html {String} The HTML string to process and extract title, subtitle and body
 * @param opts {Object} The options object
 * @param opts.h1 {String='h1'} The CSS Selector to find the title (default to 'h1')
 * @param opts.h2 {String='h2'} The CSS Selector to find the subtitle (default to 'h2')
 * @param opts.text {String='p'} The CSS Selector to find the body (default to 'p')
 * @param opts.output {String} When an output file is requried, it indicates the path to save it (ie: ./dataset/sports/sample1.txt) [Only recommended for cli usage]
 * @param print {Boolean=false} Boolean indicating wether the output should be printed in console or not
 *
 * @return {Object} The title, subtitle, body and full texts extracted from the html
 *
 * TODO Feel free to improve and extend this function to achieve greater granurality
 */
function processHtml(html, opts, print) {
  // Loading full HTML
  let dom = new JSDOM(html);
  let document = dom.window.document;
  // Splitting text headings and paragraphs
  let text = {
    title: getText(document.querySelectorAll(opts.h1 || 'h1')),
    subtitle: getText(document.querySelectorAll(opts.h2 || 'h2')),
    body: getText(document.querySelectorAll(opts.text || 'p'))
  };
  text.full = text.title + '\n' + text.subtitle + '\n' + text.body;
  // Writing output file (for sampling purposes)
  if (opts.output) {
    fs.writeFileSync(opts.output, text.full, 'utf8');
  } else if (print) {
    console.log(text.full);
  }
  return text;
}

module.exports = {
  getHtml,
  getText,
  processHtml
};


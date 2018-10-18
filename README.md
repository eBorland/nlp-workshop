NLP: Getting started
====================

**Table of Contents**

* [About](#about)
* [Requirements](#requirements)
    * [Git](#git)
    * [NodeJS](#nodejs)
    * [This project](#this-project)
    * [Global and local dependencies](#global-and-local-dependencies)
* [Usage](#usage)
    * [Scraper](#scraper)

- - -

## About
This project is created to give a base to the developers during the NLP Worshop. Is a very simple and basic NLP server accepting requests to predict text categories (intended for news categories, but can be used with any model) using Google Cloud AutoML services

## Requirements

Prior to start using or contributing to this project you must install some cool stuff.
Follow the guide using your platform-specifig instructions.

The suggestions is to install all packages using Homebrew, to install it make sure you have the XCode software and its command line tools and then run:
```sh
ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

### Git:
If you do not have git installed in your computer you must follow the steps below to install it.
If you do not know wheter you have it installed or not, you can run the following command on your terminal:

```sh
git --version
```
If the response is something like "git version 2.17.1 (Apple Git-112)" it means you already have it. If, instead, it gives you some error like "-bash: git: command not found" (or any other) it means you MUST install it.

- Platform: Mac OSX

Just type "git" in the terminal and follow the instructions to instal it
```sh
git
```

- Platform: Mac OSX (version 2, using homebrew)

Run the folowing commands in your terminal
```sh
ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
brew doctor
```
And after that, you can install git with homebrew
```sh
brew install git
```

- Platform: Linux (Debian)

Type the following commands and follow the instructions to install git
```sh
sudo apt-get update
sudo apt-get upgrade
sudo apt-get install git
```

- Platform: Linux (Red Hat)

Type the following commands and follow the instructions to install git
```sh
sudo yum upgrade
sudo yum install git
```

- Platform: Windows (seriously?)

Download [git for windows](https://gitforwindows.org/) and install it following the instructions in the package

#### Credits: https://gist.github.com/derhuerst/1b15ff4652a867391f03

### NodeJS
Once again, you must install NodeJS v8+ before you will able to run and develop for this project.
To check if you already have it installed and what version you have, you can run the following command in your terminal:
```sh
node --version
```
If the output is something like "v8.11.3" or higher, then you're all good. If its some error or the version is lower than that, you'll need to follow the instructions.
In Mac OSX or Linux, we strongly recommend to use nvm for a better management of node versions.

- Platform: Mac OSX or Linux (using curl)

Run the folowing command in your terminal
```sh
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
```

- Platform: Mac OSX or Linux (using wget)

Run the folowing command in your terminal
```sh
wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
```
After that, restart your terminal or command line and check that nvm has been successfully installed by running ```nvm -v```.
Now you are able to install the node version you want (again, you must install a version higher than v8.10):
```sh
nvm install 8.11.3
nvm alias default 8.11.3
nvm use default
```

- Platform: Windows (OMG, really?)

Download the [Windows intaller of NodeJS](https://nodejs.org/en/) (v8.12 LTS recommended) and follow the instructions

### This project
Clone this project by running the following command:
```
git clone <repo_url>
```

### Global and local dependencies
```
npm install -g yarn
yarn
```

## Usage
This project includes two mini modules to help processing and predicting texts

### Scraper
This (src/scraper.js) is an html scraper intented to be used with news in order to extract information about them.
You can use it in the command line (cli) or import it in your project to call directly its methods.
The information it extracts is the following:
- Title (by default found as the \<h1\> tag)
- Subtitle(s) (by default found as the \<h2\> tag(s))
- Body or text (by default found as all \<p\> tags concatenated)

```Note: feel free to improve the scraper to increase granularity!!```

#### Command line usage (CLI)
```sh
node src/scraper/cli.js --url https://www.bbc.com/news/world-middle-east-45904904 [--h2 null --text '.story-body__inner p']
```

The parameters are the following:
- --url: Required. It must be followed with the url of the news source
- --h1: Optional (default 'h1'). It is used to override the css selector of the title
- --h2: Optional (default 'h2'). It is used to override the css selector of the subtitle (null for no subtitle)
- --text: Optional (default 'p'). It is used to override the css selector of the body
- --output: Optional. When present, the scraper saves the full text into the indicated path (mainly used to create datasets)

Example with output
```
node src/scraper/cli.js --url https://www.bbc.com/news/world-middle-east-45904904 --h2 null --text '.story-body__inner p' --output dataset/politics/sample1.txt
```

```Note: feel free to improve the scraper to better automate the dataset generation```

#### As a module to be imported in a project
```js
const scraper = require('./src/scraper') // HEADS UP! The url might change
const options = {
  title: 'h1.title',
  subtitle: 'h2.subtitle',
  text: 'div.body'
};
const htmlText = '<html><head></head><body><h1 class="title">News title</h1><h2 class="subtitle">Subtitle would go here</h2><div class="body">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras eleifend dui eget cursus porttitor. Etiam a imperdiet nunc. Sed convallis luctus nulla, quis lobortis erat fringilla at. Morbi orci nisl, iaculis ac placerat eget, ultricies at ligula. Praesent congue mi eu fermentum maximus. Nam placerat metus vitae sapien scelerisque, ut bibendum eros efficitur.</div></body></html>';
let result = scraper.processHtml(htmlText, options);
// result will be an object with title, subtitle and body
```

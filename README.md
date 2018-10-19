NLP: Getting started
====================

**Table of Contents**

* [About](#about)
* [Requirements](#requirements)
    * [Git](#git)
    * [NodeJS](#nodejs)
    * [This project](#this-project)
    * [Global and local dependencies](#global-and-local-dependencies)
    * [Google Cloud Account](#gogle-cloud-account)
    * [Google Cloud AutoML Model](#gogle-cloud-automl-model)
* [Usage](#usage)
    * [Scraper](#scraper)
    * [NLP Server](#nlp-server)

- - -

## About
This project is created to give a base to the developers during the NLP Worshop. Is a very simple and basic NLP server accepting requests to predict text categories (intended for news categories, but can be used with any model) using Google Cloud AutoML services

## Requirements

Prior to start using or contributing to this project you must install some cool stuff.
Follow the guide using your platform-specifig instructions.

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
git clone https://github.com/eBorland/nlp-workshop.git
```

### Global and local dependencies
```
npm install -g yarn
yarn
```

### Google Cloud Account
To get a Google Cloud Account, you have two options.

#### Option 1 - Only the brave. Use it only if:
- You want to have full control
- You have a credit/debit card and don't afraid to use it online. HEADS UP! It should be FREE but if you are not carefull, Google might CHARGE YOU. Use it under your own responsability.

If you chose to have full control, these are the steps you must follow.

1) Form teams of 4, assign your team a name and create (or use an existing one) a google account.
2) Send an email with subject "[BRAVE] HackUPC Team: <team name>" to eric.borlandacosta@soprasteria.com indicating the fullname of each of you and the google account email you decided to use.
1) Signup for [Google Cloud](https://cloud.google.com/)
2) Login into the [Google Cloud Console](https://console.cloud.google.com)
3) Create a Project
4) Go to APIs
// TODO Credentials

#### Option 2 - Not credit/debit card required:
1) Form teams of 4, assign your team a name and create (or use an existing one) a google account.
2) Send an email with subject "HackUPC Team: <team name>" to eric.borlandacosta@soprasteria.com indicating the fullname of each of you and the google account email you decided to use.
3) Wait to be assigned to a Google Cloud Project. We will send you a .credentials.json file that you will have to include into the root of this project
4) Once receive the Google Cloud email, follow the instructions to signup into Google Cloud

### Google Cloud AutoML Model
1) Login into the [Google Cloud Console](https://console.cloud.google.com)
2) Go to [Natural Language](https://cloud.google.com/automl/ui/text/overview)
3) Select "Get started with AutoML"
4) [ONLY THE BRAVE] It will require to activate Billing account and to enable the API. Follow the manual steps using the console. // TODO
5) Create a new dataset by clicking on "New dataset"

```Brief explanation of AutoML and Datasets: https://cloud.google.com/natural-language/automl/docs/beginners-guide```

```Create an inclusive Model: https://cloud.google.com/inclusive-ml/```

6) Compress and import the dataset located in ./dataset/ folder or create one of your own (you can try with multi-label if your model requires it)
7) Wait until the dataset is processed, keep in mind that the bigger the dataset, the longer it will take to process it
8) Once is processed, you must train your model. Click on train and wait until the training is completed. It might take several hours
9) Once the model is prepared, you just have to add a config/dev.json file with the path to your model (replacing <PROJECT_ID> and <MODEL_ID> like the following:

```json
{
  "AUTOML": {
    "MODEL_PATH": [<PROJECT_ID>, "us-central1", <MODEL_ID>]
  }
}
```

And you're all set up! Congrats!

- - - -

## Usage
This project includes two mini modules to help processing and predicting texts

### Scraper
This module (src/scraper.js) is an html scraper intented to be used with news in order to extract information about them.
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

### NLP Server
NLP Server is the main module of this project allowing the user to perform requests to use the scraper and to predict categories using Google Cloud AutoML service

To start using it, run the following command:
```sh
npm start
```

And you will have a server listening to localhost:3000. The following requests are available:

- POST '/predict/text'
This is used to predict the category using directly a plain text. This is an example of a full request:
```sh
POST localhost:3000/predict/text
HEADER Content-Type="application/json"
BODY
{
  "content": "The Oasis icon explained how the moment of mistaken identity came as he began recording the follow-up to 2017’s acclaimed ‘Who Built The Moon?’“I’ve already been in the studio”, Noel told the Press Association.”I was in fucking Abbey Road for two weeks, and I walked past that zebra crossing every day to get recognised.“Tourists were walking across barefoot. Still no-one stopped. I got stopped once by a black cab driver who went past and went ‘all right Liam?’”oel Gallagher, 2018Noel, who picked up the awards for best solo artist and outstanding contribution to music at the Q Awards, also admitted that he’s now enjoying making music more than ever.Latest News Field Day festival is moving, again Mark Hoppus shares original lyric book from Blink-182’s ‘Untitled’ Watch Matt Bellamy and Graham Coxon’s Jaded Hearts Club Band perform another epic night of dad-rock covers “When you’re young it’s all in front of you. Now with a bit of time behind me, it feels different”, he admitted. “How many records are you going to make? When you are in the studio you have to give it your all. I love it. I love it now more than I ever have before.” Earlier this year, Noel teased that he may in fact have two albums’ worth of new material due for release. “I’ve got a whole backlog of songs, I write all the time so I’ve got plenty of material,” he said. “I’m going to make another record with David in this way but the last one took four years so I’ll probably have to make another one alongside it in the more traditional sense.”  Speaking to NME, he suggested that some of his new material sounded like ‘The Police meets The Cure‘."
}
```
In this example, the server should respod back a 50% chance of Culture text

- POST '/predict/url'
This is used to predict the category getting the text from a url
```sh
POST localhost:3000/predict/url
HEADER Content-Type="application/json"
BODY
{
  "url": "https://www.bbc.com/news/business-45910262",
  "options": {
    "h2": null,
    "text": ".story-body__inner p"
  }
}
```
In this example, the response from the server should be a 99% chance of economics news

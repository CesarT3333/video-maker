const algorithmia = require('algorithmia');
const algorithmiaApiKey = require('../credentials/algorithmia.json').apiKey;

async function robot(content) {
    await fetchContentFromWikipedia(content);
    // sanitilizeContent(content);
    // breakContentIntoSequences(content);
}

async function fetchContentFromWikipedia(content) {

    await algorithmia.client(algorithmiaApiKey)
        .algo("web/WikipediaParser/0.1.2")
        .pipe(content.searchTerm)
        .then(response => {
            console.log(response);
        });

}

function sanitilizeContent(content) { }

function breakContentIntoSequences(content) { }

module.exports = robot;

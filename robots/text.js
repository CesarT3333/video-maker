const algorithmia = require('algorithmia');
const algorithmiaApiKey = require('../credentials/algorithmia.json').apiKey;
const sentenceBoundaryDetection = require('sbd');

async function robot(content) {
    await fetchContentFromWikipedia(content);
    sanitilizeContent(content);
    breakContentIntoSequences(content);
}

async function fetchContentFromWikipedia(content) {

    const wikipediaResponse =
        await algorithmia.client(algorithmiaApiKey)
            .algo("web/WikipediaParser/0.1.2")
            .pipe(content.searchTerm);

    const wikipediaContent = wikipediaResponse.get();

    content.sourceContentOriginal = wikipediaContent.content;

}

function sanitilizeContent(content) {

    const withoutBlankLinesAndMArkdown =
        removeBlankLinesAndMarkDown(content.sourceContentOriginal);

    const withoutDatesInParentheses =
        removeDatesInParentheses(withoutBlankLinesAndMArkdown);

    content.sourceContentSanitized = withoutDatesInParentheses;

    function removeBlankLinesAndMarkDown(text) {
        const allLines = text.split('\n');

        return allLines
            .filter(line =>
                line.trim().length !== 0 && !line.trim().startsWith('='))
            .join(' ');

    }

    function removeDatesInParentheses(text) {
        return text.replace(/\((?:\([^()]*\)|[^()])*\)/gm, '').replace(/  /g, ' ')
    }

}

function breakContentIntoSequences(content) {
    content.sentences = [];
    
    const sentences = sentenceBoundaryDetection
        .sentences(content.sourceContentSanitized);

    sentences.forEach(sentence =>
        content.sentences.push({
            text: sentence,
            keywords: [],
            images: []
        }));

}

module.exports = robot;

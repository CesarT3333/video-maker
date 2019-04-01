import * as state from './state';

import * as sentenceBoundaryDetection from 'sbd';

import * as algorithmia from 'algorithmia';

import * as algorithmiaCredentials from '../credentials/algorithmia.json';
import * as watsonCredentials from '../credentials/watson-nlu.json';

const NaturalLanguageUnderstandingV1 =
    require('watson-developer-cloud/natural-language-understanding/v1.js');

const algorithmiaApiKey: string =
    (<any>algorithmiaCredentials).apiKey;

const watsonApiKey: string =
    (<any>watsonCredentials).apikey;

const nlu = new NaturalLanguageUnderstandingV1({
    iam_apikey: watsonApiKey,
    version: '2018-04-05',
    url: 'https://gateway.watsonplatform.net/natural-language-understanding/api/'
});

export async function text() {
    const content = state.load();

    await fetchContentFromWikipedia(content);
    sanitilizeContent(content);
    breakContentIntoSequences(content);
    limitMaximumSentences(content);
    await fetchKeywordsOfAllSentences(content);

    state.save(content);
}

async function fetchContentFromWikipedia(content) {

    const wikipediaResponse =
        await algorithmia.client(algorithmiaApiKey)
            .algo("web/WikipediaParser/0.1.2")
            .pipe(content.searchTerm);

    const wikipediaContent = wikipediaResponse.get();

    content.sourceContentOriginal = wikipediaContent.content;

}

async function fetchKeywordsOfAllSentences(content) {
    for (const s of content.sentences) {
        s.keywords = await fetchWatsonAndReturnKeywords(s.text);
    }
}

async function fetchWatsonAndReturnKeywords(sentence) {
    return new Promise((resolve, reject) => {
        nlu.analyze({
            text: sentence,
            features: {
                keywords: {}
            },
        }, (err, resp) => {

            if (err) { throw err };

            const keywords = resp.keywords.map((kw) => kw.text);

            resolve(keywords);
        });
    });
}

function limitMaximumSentences(content) {
    content.sentences = content.sentences
        .slice(0, content.maximumSentences);
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

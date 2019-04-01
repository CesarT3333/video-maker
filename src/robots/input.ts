import * as readline from 'readline-sync';
import * as  state from './state';

export function input() {

    const content = {
        maximumSentences: 7,
        searchTerm: '',
        prefix: ''
    };

    content.searchTerm = askAndReturnSearchTerm();
    content.prefix = askAndReturnPrefix();

    state.save(content);

}

function askAndReturnSearchTerm() {
    return readline.question('Type a Wikpedia search term: ');
}

function askAndReturnPrefix() {

    const prefixes = ['Who is', 'What is', 'The history of'];

    const selectedPrefixIndex = readline.keyInSelect(prefixes);

    return prefixes[selectedPrefixIndex];
}

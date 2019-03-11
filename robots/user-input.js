const readline = require('readline-sync');

function robot(content) {
    content.searchTerm = askAndReturnSearchTerm();
    content.prefix = askAndReturnPrefix();
}

function askAndReturnSearchTerm() {
    return readline.question('Type a Wikpedia search term: ');
}

function askAndReturnPrefix() {

    const prefixes = ['Who is', 'What is', 'The history of'];

    const selectedPrefixIndex = readline.keyInSelect(prefixes);

    return prefixes[selectedPrefixIndex];
}

module.exports = robot;
"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var readline = __importStar(require("readline-sync"));
var state = __importStar(require("./state"));
function input() {
    var content = {
        maximumSentences: 7,
        searchTerm: '',
        prefix: ''
    };
    content.searchTerm = askAndReturnSearchTerm();
    content.prefix = askAndReturnPrefix();
    state.save(content);
}
exports.input = input;
function askAndReturnSearchTerm() {
    return readline.question('Type a Wikpedia search term: ');
}
function askAndReturnPrefix() {
    var prefixes = ['Who is', 'What is', 'The history of'];
    var selectedPrefixIndex = readline.keyInSelect(prefixes);
    return prefixes[selectedPrefixIndex];
}

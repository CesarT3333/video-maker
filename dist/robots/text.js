"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var state = require('./state.js');
var sentenceBoundaryDetection = __importStar(require("sbd"));
var algorithmia = __importStar(require("algorithmia"));
var algorithmiaCredentials = __importStar(require("../credentials/algorithmia.json"));
var watsonCredentials = __importStar(require("../credentials/watson-nlu.json"));
var algorithmiaApiKey = algorithmiaCredentials.apiKey;
var watsonApiKey = watsonCredentials.apikey;
var NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');
var nlu = new NaturalLanguageUnderstandingV1({
    iam_apikey: watsonApiKey,
    version: '2018-04-05',
    url: 'https://gateway.watsonplatform.net/natural-language-understanding/api/'
});
function text() {
    return __awaiter(this, void 0, void 0, function () {
        var content;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    content = state.load();
                    return [4 /*yield*/, fetchContentFromWikipedia(content)];
                case 1:
                    _a.sent();
                    sanitilizeContent(content);
                    breakContentIntoSequences(content);
                    limitMaximumSentences(content);
                    return [4 /*yield*/, fetchKeywordsOfAllSentences(content)];
                case 2:
                    _a.sent();
                    state.save(content);
                    return [2 /*return*/];
            }
        });
    });
}
exports.text = text;
function fetchContentFromWikipedia(content) {
    return __awaiter(this, void 0, void 0, function () {
        var wikipediaResponse, wikipediaContent;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, algorithmia.client(algorithmiaApiKey)
                        .algo("web/WikipediaParser/0.1.2")
                        .pipe(content.searchTerm)];
                case 1:
                    wikipediaResponse = _a.sent();
                    wikipediaContent = wikipediaResponse.get();
                    content.sourceContentOriginal = wikipediaContent.content;
                    return [2 /*return*/];
            }
        });
    });
}
function fetchKeywordsOfAllSentences(content) {
    return __awaiter(this, void 0, void 0, function () {
        var _i, _a, s, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _i = 0, _a = content.sentences;
                    _c.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 4];
                    s = _a[_i];
                    _b = s;
                    return [4 /*yield*/, fetchWatsonAndReturnKeywords(s.text)];
                case 2:
                    _b.keywords = _c.sent();
                    _c.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function fetchWatsonAndReturnKeywords(sentence) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    nlu.analyze({
                        text: sentence,
                        features: {
                            keywords: {}
                        },
                    }, function (err, resp) {
                        if (err) {
                            throw err;
                        }
                        ;
                        var keywords = resp.keywords.map(function (kw) { return kw.text; });
                        resolve(keywords);
                    });
                })];
        });
    });
}
function limitMaximumSentences(content) {
    content.sentences = content.sentences
        .slice(0, content.maximumSentences);
}
function sanitilizeContent(content) {
    var withoutBlankLinesAndMArkdown = removeBlankLinesAndMarkDown(content.sourceContentOriginal);
    var withoutDatesInParentheses = removeDatesInParentheses(withoutBlankLinesAndMArkdown);
    content.sourceContentSanitized = withoutDatesInParentheses;
    function removeBlankLinesAndMarkDown(text) {
        var allLines = text.split('\n');
        return allLines
            .filter(function (line) {
            return line.trim().length !== 0 && !line.trim().startsWith('=');
        })
            .join(' ');
    }
    function removeDatesInParentheses(text) {
        return text.replace(/\((?:\([^()]*\)|[^()])*\)/gm, '').replace(/  /g, ' ');
    }
}
function breakContentIntoSequences(content) {
    content.sentences = [];
    var sentences = sentenceBoundaryDetection
        .sentences(content.sourceContentSanitized);
    sentences.forEach(function (sentence) {
        return content.sentences.push({
            text: sentence,
            keywords: [],
            images: []
        });
    });
}

"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = __importStar(require("fs"));
var contentFilePath = './content.json';
function save(content) {
    var contentString = JSON.stringify(content);
    return fs.writeFileSync(contentFilePath, contentString);
}
exports.save = save;
function load() {
    var fileBuffer = fs.readFileSync(contentFilePath, 'utf-8');
    var contentJson = JSON.parse(fileBuffer);
    return contentJson;
}
exports.load = load;

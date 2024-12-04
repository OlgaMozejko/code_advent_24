"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
function parseInstructions(memory) {
    var mulRegex = /mul\((\d+),(\d+)\)/g;
    var doRegex = /do\(\)/g;
    var dontRegex = /don't\(\)/g;
    var resultPart1 = 0;
    var resultPart2 = 0;
    var isEnabled = true;
    var tokens = memory.split(/(?=mul\()|(?=do\(\))|(?=don't\(\))/);
    for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
        var token = tokens_1[_i];
        if (doRegex.test(token)) {
            isEnabled = true;
        }
        else if (dontRegex.test(token)) {
            isEnabled = false;
        }
        else {
            var match = mulRegex.exec(token);
            if (match) {
                var x = parseInt(match[1], 10);
                var y = parseInt(match[2], 10);
                var product = x * y;
                resultPart1 += product;
                if (isEnabled) {
                    resultPart2 += product;
                }
            }
        }
    }
    return { resultPart1: resultPart1, resultPart2: resultPart2 };
}
function main() {
    var filePath = './input.txt';
    var memory = fs.readFileSync(filePath, 'utf-8').trim();
    var _a = parseInstructions(memory), resultPart1 = _a.resultPart1, resultPart2 = _a.resultPart2;
    console.log('Sum of Valid Multiplications :', resultPart1);
    console.log('Sum of Enabled Multiplications :', resultPart2);
}
main();

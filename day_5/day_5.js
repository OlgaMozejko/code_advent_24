"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
function parseInput(input) {
    var _a = input.trim().split("\n\n"), rulesSection = _a[0], updatesSection = _a[1];
    var rules = rulesSection.split("\n").map(function (rule) {
        var _a = rule.split("|").map(Number), X = _a[0], Y = _a[1];
        return [X, Y];
    });
    var updates = updatesSection.split("\n").map(function (update) {
        return update.split(",").map(Number);
    });
    return { rules: rules, updates: updates };
}
function isValidUpdate(update, rules) {
    for (var _i = 0, rules_1 = rules; _i < rules_1.length; _i++) {
        var _a = rules_1[_i], X = _a[0], Y = _a[1];
        var xIndex = update.indexOf(X);
        var yIndex = update.indexOf(Y);
        if (xIndex !== -1 && yIndex !== -1 && xIndex > yIndex) {
            return false;
        }
    }
    return true;
}
function reorderUpdate(update, rules) {
    var dependencyGraph = new Map();
    for (var _i = 0, update_1 = update; _i < update_1.length; _i++) {
        var page = update_1[_i];
        dependencyGraph.set(page, new Set());
    }
    for (var _a = 0, rules_2 = rules; _a < rules_2.length; _a++) {
        var _b = rules_2[_a], X = _b[0], Y = _b[1];
        if (update.includes(X) && update.includes(Y)) {
            dependencyGraph.get(Y).add(X);
        }
    }
    var visited = new Set();
    var result = [];
    function visit(page) {
        if (visited.has(page))
            return;
        visited.add(page);
        for (var _i = 0, _a = Array.from(dependencyGraph.get(page)); _i < _a.length; _i++) {
            var dependency = _a[_i];
            visit(dependency);
        }
        result.push(page);
    }
    for (var _c = 0, update_2 = update; _c < update_2.length; _c++) {
        var page = update_2[_c];
        visit(page);
    }
    return result.reverse();
}
function getMiddlePage(update) {
    var middleIndex = Math.floor(update.length / 2);
    return update[middleIndex];
}
function calculateMiddleSumForValidUpdates(input) {
    var _a = parseInput(input), rules = _a.rules, updates = _a.updates;
    var middleSum = 0;
    for (var _i = 0, updates_1 = updates; _i < updates_1.length; _i++) {
        var update = updates_1[_i];
        if (isValidUpdate(update, rules)) {
            middleSum += getMiddlePage(update);
        }
    }
    return middleSum;
}
function calculateMiddleSumForReorderedUpdates(input) {
    var _a = parseInput(input), rules = _a.rules, updates = _a.updates;
    var middleSum = 0;
    for (var _i = 0, updates_2 = updates; _i < updates_2.length; _i++) {
        var update = updates_2[_i];
        if (!isValidUpdate(update, rules)) {
            var reordered = reorderUpdate(update, rules);
            middleSum += getMiddlePage(reordered);
        }
    }
    return middleSum;
}
function main() {
    var inputFile = 'input.txt';
    var input = fs.readFileSync(inputFile, 'utf-8');
    var partOneResult = calculateMiddleSumForValidUpdates(input);
    console.log("Part One: ".concat(partOneResult));
    var partTwoResult = calculateMiddleSumForReorderedUpdates(input);
    console.log("Part Two: ".concat(partTwoResult));
}
main();

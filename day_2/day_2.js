"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
function parseInput(filePath) {
    var data = fs.readFileSync(filePath, 'utf-8').trim();
    return data.split('\n').map(function (line) { return line.split(/\s+/).map(Number); });
}
function isSafeReport(levels) {
    var isIncreasing = levels.every(function (val, idx) { return idx === 0 || val > levels[idx - 1]; });
    var isDecreasing = levels.every(function (val, idx) { return idx === 0 || val < levels[idx - 1]; });
    if (!isIncreasing && !isDecreasing) {
        return false;
    }
    return levels.every(function (val, idx) {
        if (idx === 0)
            return true;
        var diff = Math.abs(val - levels[idx - 1]);
        return diff >= 1 && diff <= 3;
    });
}
function canBeMadeSafe(levels) {
    for (var i = 0; i < levels.length; i++) {
        var modifiedLevels = levels.slice(0, i).concat(levels.slice(i + 1));
        if (isSafeReport(modifiedLevels)) {
            return true;
        }
    }
    return false;
}
function main() {
    var filePath = './input.txt';
    var reports = parseInput(filePath);
    var safeReportsCount = reports.filter(isSafeReport).length;
    var safeOrFixableReportsCount = reports.filter(function (report) { return isSafeReport(report) || canBeMadeSafe(report); }).length;
    console.log('Safe Reports :', safeReportsCount);
    console.log('Safe or Fixable Reports :', safeOrFixableReportsCount);
}
main();

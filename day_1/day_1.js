"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
function parseInput(filePath) {
    var data = fs.readFileSync(filePath, 'utf-8').trim();
    var leftList = [];
    var rightList = [];
    for (var _i = 0, _a = data.split('\n'); _i < _a.length; _i++) {
        var line = _a[_i];
        var _b = line.split(/\s+/).map(Number), left = _b[0], right = _b[1];
        leftList.push(left);
        rightList.push(right);
    }
    return { leftList: leftList, rightList: rightList };
}
function calculateTotalDistance(leftList, rightList) {
    var sortedLeft = __spreadArray([], leftList, true).sort(function (a, b) { return a - b; });
    var sortedRight = __spreadArray([], rightList, true).sort(function (a, b) { return a - b; });
    var totalDistance = 0;
    for (var i = 0; i < sortedLeft.length; i++) {
        totalDistance += Math.abs(sortedLeft[i] - sortedRight[i]);
    }
    return totalDistance;
}
function calculateSimilarityScore(leftList, rightList) {
    var rightFrequency = {};
    for (var _i = 0, rightList_1 = rightList; _i < rightList_1.length; _i++) {
        var num = rightList_1[_i];
        rightFrequency[num] = (rightFrequency[num] || 0) + 1;
    }
    var similarityScore = 0;
    for (var _a = 0, leftList_1 = leftList; _a < leftList_1.length; _a++) {
        var num = leftList_1[_a];
        if (rightFrequency[num]) {
            similarityScore += num * rightFrequency[num];
        }
    }
    return similarityScore;
}
function main() {
    var filePath = './input.txt';
    var _a = parseInput(filePath), leftList = _a.leftList, rightList = _a.rightList;
    var totalDistance = calculateTotalDistance(leftList, rightList);
    var similarityScore = calculateSimilarityScore(leftList, rightList);
    console.log('Total Distance :', totalDistance);
    console.log('Similarity Score :', similarityScore);
}
main();

"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
// Parse the input map
function parseInput(map) {
    var grid = map.split("\n").map(function (row) { return row.split(""); });
    var start = null;
    var direction = null;
    for (var y = 0; y < grid.length; y++) {
        for (var x = 0; x < grid[y].length; x++) {
            var cell = grid[y][x];
            if (['^', '>', 'v', '<'].includes(cell)) {
                start = { x: x, y: y };
                direction = cell;
                grid[y][x] = '.'; // Replace guard symbol with empty space
                break;
            }
        }
        if (start)
            break;
    }
    if (!start || !direction)
        throw new Error("Guard's starting position or direction not found.");
    return { grid: grid, start: start, direction: direction };
}
// Simulate the guard's patrol
function simulateGuard(grid, start, direction) {
    var visited = new Set();
    var directions = ['^', '>', 'v', '<'];
    var moves = {
        '^': [0, -1], // Up
        '>': [1, 0], // Right
        'v': [0, 1], // Down
        '<': [-1, 0], // Left
    };
    var position = __assign({}, start);
    var facing = direction;
    // Mark the starting position as visited
    var markVisited = function (pos) { return visited.add("".concat(pos.x, ",").concat(pos.y)); };
    markVisited(position);
    var debugGrid = function () {
        var copy = grid.map(function (row) { return __spreadArray([], row, true); });
        for (var _i = 0, visited_1 = visited; _i < visited_1.length; _i++) {
            var key = visited_1[_i];
            var _a = key.split(",").map(Number), x = _a[0], y = _a[1];
            copy[y][x] = 'X'; // Mark visited positions
        }
        console.log(copy.map(function (row) { return row.join(""); }).join("\n"));
        console.log();
    };
    debugGrid(); // Debug the initial state
    while (true) {
        var _a = moves[facing], dx = _a[0], dy = _a[1];
        var nextX = position.x + dx;
        var nextY = position.y + dy;
        // Check if the guard leaves the grid
        if (nextX < 0 || nextY < 0 || nextY >= grid.length || nextX >= grid[0].length) {
            break;
        }
        // Get the next cell
        var nextCell = grid[nextY][nextX];
        if (nextCell === '#') {
            // If there is an obstacle, turn right
            var currentIndex = directions.indexOf(facing);
            facing = directions[(currentIndex + 1) % directions.length];
        }
        else {
            // Move forward
            position = { x: nextX, y: nextY };
            markVisited(position);
        }
        debugGrid(); // Debug after each move
    }
    // Return the number of unique positions visited
    return visited.size;
}
// Main function to run the simulation
function main() {
    var inputFile = 'input.txt';
    var input = fs.readFileSync(inputFile, 'utf-8');
    var _a = parseInput(input), grid = _a.grid, start = _a.start, direction = _a.direction;
    var result = simulateGuard(grid, start, direction);
    console.log("The guard visited ".concat(result, " distinct positions."));
}
// Run the main function
main();

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
// Parse the input grid
function parseGrid(filePath) {
    var data = fs.readFileSync(filePath, 'utf-8').trim();
    return data.split('\n').map(function (line) { return line.split(''); });
}
// Count X-MAS patterns in the grid
function countXMASPatterns(grid) {
    var rows = grid.length;
    var cols = grid[0].length;
    var count = 0;
    // Check if a position is valid
    function isValidPosition(x, y) {
        return x >= 0 && x < rows && y >= 0 && y < cols;
    }
    // Check for a valid diagonal (MAS or SAM) based on direction
    function checkDiagonal(x1, y1, x2, y2) {
        if (isValidPosition(x1, y1) &&
            isValidPosition(x2, y2) &&
            ((grid[x1][y1] === 'M' && grid[x2][y2] === 'S') ||
                (grid[x1][y1] === 'S' && grid[x2][y2] === 'M'))) {
            return true;
        }
        return false;
    }
    // Check for an X-MAS pattern centered at (x, y)
    function checkXMASPattern(x, y) {
        // Top-left and bottom-right diagonal positions
        var topLeft = [x - 1, y - 1];
        var topRight = [x - 1, y + 1];
        var bottomLeft = [x + 1, y - 1];
        var bottomRight = [x + 1, y + 1];
        // Check if both diagonals form a valid X-MAS pattern
        return (checkDiagonal(topLeft[0], topLeft[1], bottomRight[0], bottomRight[1]) &&
            checkDiagonal(topRight[0], topRight[1], bottomLeft[0], bottomLeft[1]));
    }
    // Traverse the grid to count patterns
    for (var row = 1; row < rows - 1; row++) {
        for (var col = 1; col < cols - 1; col++) {
            if (grid[row][col] === 'A' && checkXMASPattern(row, col)) {
                count++;
            }
        }
    }
    return count;
}
// Main function to execute the solution
function main() {
    var filePath = './input.txt'; // Replace with your input file path
    var grid = parseGrid(filePath);
    var xmasPatternsCount = countXMASPatterns(grid);
    console.log("Total occurrences of \"X-MAS\" patterns:", xmasPatternsCount);
}
main();

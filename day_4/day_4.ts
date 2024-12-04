import * as fs from 'fs';

function parseGrid(filePath: string): string[][] {
  const data = fs.readFileSync(filePath, 'utf-8').trim();
  return data.split('\n').map(line => line.split(''));
}


const DIRECTIONS = [
  [0, 1],   // Right
  [1, 0],   // Down
  [1, 1],   // Diagonal down-right
  [1, -1],  // Diagonal down-left
  [0, -1],  // Left
  [-1, 0],  // Up
  [-1, -1], // Diagonal up-left
  [-1, 1],  // Diagonal up-right
];

function countXMASOccurrences(grid: string[][], word: string): number {
  const rows = grid.length;
  const cols = grid[0].length;
  const wordLength = word.length;
  let count = 0;

  function isValidPosition(x: number, y: number): boolean {
    return x >= 0 && x < rows && y >= 0 && y < cols;
  }

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      for (const [dx, dy] of DIRECTIONS) {
        let match = true;

        for (let k = 0; k < wordLength; k++) {
          const nx = row + k * dx;
          const ny = col + k * dy;

          if (!isValidPosition(nx, ny) || grid[nx][ny] !== word[k]) {
            match = false;
            break;
          }
        }

        if (match) {
          count++;
        }
      }
    }
  }

  return count;
}


function countXMASPatterns(grid: string[][]): number {
  const rows = grid.length;
  const cols = grid[0].length;
  let count = 0;

  function isValidPosition(x: number, y: number): boolean {
    return x >= 0 && x < rows && y >= 0 && y < cols;
  }

  function checkXMASPattern(x: number, y: number): boolean {
    const topLeft = [x - 1, y - 1];
    const topRight = [x - 1, y + 1];
    const bottomLeft = [x + 1, y - 1];
    const bottomRight = [x + 1, y + 1];

    const diagonals = [
      [topLeft, bottomRight],
      [topRight, bottomLeft],
    ];

    for (const [[mx1, my1], [mx2, my2]] of diagonals) {
      if (
        isValidPosition(mx1, my1) &&
        isValidPosition(mx2, my2) &&
        ((grid[mx1][my1] === 'M' && grid[mx2][my2] === 'S') ||
          (grid[mx1][my1] === 'S' && grid[mx2][my2] === 'M'))
      ) {
        return true;
      }
    }
    return false;
  }

  for (let row = 1; row < rows - 1; row++) {
    for (let col = 1; col < cols - 1; col++) {
      if (grid[row][col] === 'A' && checkXMASPattern(row, col)) {
        count++;
      }
    }
  }

  return count;
}


function main() {
  const filePath = './input.txt'; 
  const grid = parseGrid(filePath);


  const part1Occurrences = countXMASOccurrences(grid, "XMAS");
  console.log(`Total occurrences of "XMAS" (Part 1):`, part1Occurrences);

  const part2Patterns = countXMASPatterns(grid);
  console.log(`Total occurrences of "X-MAS" patterns (Part 2):`, part2Patterns);
}

main();

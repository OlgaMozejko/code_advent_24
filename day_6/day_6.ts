/*import * as fs from 'fs';

type Direction = '^' | '>' | 'v' | '<';
type Position = { x: number; y: number };


function parseInput(map: string): { grid: string[][]; start: Position; direction: Direction } {
    const grid = map.split("\n").map(row => row.split(""));
    let start: Position | null = null;
    let direction: Direction | null = null;

    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            const cell = grid[y][x];
            if (['^', '>', 'v', '<'].includes(cell)) {
                start = { x, y };
                direction = cell as Direction;
                grid[y][x] = '.'; // Replace guard symbol with an empty space
                break;
            }
        }
        if (start) break;
    }

    if (!start || !direction) throw new Error("Guard's starting position or direction not found.");
    return { grid, start, direction };
}


function simulateGuard(grid: string[][], start: Position, direction: Direction): string[][] {
    const moves: Record<Direction, [number, number]> = {
        '^': [0, -1], // Move up
        '>': [1, 0],  // Move right
        'v': [0, 1],  // Move down
        '<': [-1, 0], // Move left
    };

    const directions: Direction[] = ['^', '>', 'v', '<'];
    let position = { ...start };
    let facing = direction;

    // Mark the starting position
    if (grid[position.y][position.x] === '.') grid[position.y][position.x] = 'X';

    while (true) {
        const [dx, dy] = moves[facing];
        const nextX = position.x + dx;
        const nextY = position.y + dy;

        // Stop if the guard moves out of bounds
        if (nextX < 0 || nextY < 0 || nextY >= grid.length || nextX >= grid[0].length) {
            break;
        }

        const nextCell = grid[nextY][nextX];

        if (nextCell === '#') {
            // Turn 90 degrees to the right
            const currentIndex = directions.indexOf(facing);
            facing = directions[(currentIndex + 1) % directions.length];
        } else {
            // Move forward
            position = { x: nextX, y: nextY };
            if (grid[position.y][position.x] === '.') {
                grid[position.y][position.x] = 'X'; // Mark as visited
            }
        }
    }

    return grid;
}


function countVisited(grid: string[][]): number {
    return grid.reduce((count, row) => count + row.filter(cell => cell === 'X').length, 0);
}


function main() {
    const inputFile = 'input.txt'; // Replace with your input file name
    const outputFile = 'output.txt'; // Replace with your desired output file name

    // Read and parse the input file
    const input = fs.readFileSync(inputFile, 'utf-8');
    const { grid, start, direction } = parseInput(input);

    // Simulate the guard's movements
    const updatedGrid = simulateGuard(grid, start, direction);

    // Write the updated grid to the output file
    const output = updatedGrid.map(row => row.join("")).join("\n");
    fs.writeFileSync(outputFile, output, 'utf-8');

    // Count the number of visited positions
    const visitedCount = countVisited(updatedGrid);
    console.log(`The guard visited ${visitedCount} unique positions (marked as 'X').`);

    console.log(`Simulation complete. Updated grid written to '${outputFile}'.`);
}

// main();*/
import * as fs from 'fs';

type Direction = '^' | '>' | 'v' | '<';
type Position = { x: number; y: number };

function parseInput(map: string): { grid: string[][]; start: Position; direction: Direction } {
    const grid = map.split("\n").map(row => row.split(""));
    let start: Position | null = null;
    let direction: Direction | null = null;

    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            const cell = grid[y][x];
            if (['^', '>', 'v', '<'].includes(cell)) {
                start = { x, y };
                direction = cell as Direction;
                grid[y][x] = '.'; // Replace the guard symbol with an empty space
                break;
            }
        }
        if (start) break;
    }

    if (!start || !direction) throw new Error("Guard's starting position or direction not found.");
    return { grid, start, direction };
}

function simulateWithObstruction(grid: string[][], start: Position, direction: Direction, obstruction: Position): boolean {
    const moves: Record<Direction, [number, number]> = {
        '^': [0, -1],
        '>': [1, 0],
        'v': [0, 1],
        '<': [-1, 0],
    };

    const directions: Direction[] = ['^', '>', 'v', '<'];
    let position = { ...start };
    let facing = direction;
    const visitedStates = new Set<string>();

    while (true) {
        const stateKey = `${position.x},${position.y},${facing}`;
        if (visitedStates.has(stateKey)) {
            // Detected a loop
            return true;
        }
        visitedStates.add(stateKey);

        const [dx, dy] = moves[facing];
        const nextX = position.x + dx;
        const nextY = position.y + dy;

        if (nextX < 0 || nextY < 0 || nextY >= grid.length || nextX >= grid[0].length) {
            // Guard moves out of bounds
            break;
        }

        if (nextX === obstruction.x && nextY === obstruction.y) {
            // Obstruction blocks the path, turn right
            facing = directions[(directions.indexOf(facing) + 1) % directions.length];
        } else if (grid[nextY][nextX] === '#') {
            // Wall or obstacle, turn right
            facing = directions[(directions.indexOf(facing) + 1) % directions.length];
        } else {
            // Move forward
            position = { x: nextX, y: nextY };
        }
    }

    return false;
}

function findValidObstructions(grid: string[][], start: Position, direction: Direction): Position[] {
    const validObstructions: Position[] = [];

    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            if (grid[y][x] === '.' && !(x === start.x && y === start.y)) {
                const obstruction = { x, y };
                if (simulateWithObstruction(grid, start, direction, obstruction)) {
                    validObstructions.push(obstruction);
                }
            }
        }
    }

    return validObstructions;
}

function mainPartTwo() {
    const inputFile = 'input.txt';
    const outputFile = 'output_part2.txt';

    // Read and parse the input file
    const input = fs.readFileSync(inputFile, 'utf-8');
    const { grid, start, direction } = parseInput(input);

    // Find all valid positions for the obstruction
    const validObstructions = findValidObstructions(grid, start, direction);

    // Output the number of valid obstructions
    console.log(`Number of valid obstruction positions: ${validObstructions.length}`);

    // Create a copy of the grid to visualize the obstructions
    const outputGrid = grid.map(row => [...row]);
    for (const pos of validObstructions) {
        outputGrid[pos.y][pos.x] = 'O';
    }

    // Write the updated grid to the output file
    const output = outputGrid.map(row => row.join("")).join("\n");
    fs.writeFileSync(outputFile, output);

    console.log(`Updated grid with obstructions written to ${outputFile}`);
}

// Run Part 2
mainPartTwo();

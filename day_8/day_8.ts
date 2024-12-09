import * as fs from "fs";

interface Point {
  x: number;
  y: number;
}

// Utility to find all antennas of the same frequency
function findAntennas(map: string[], frequency: string): Point[] {
  const antennas: Point[] = [];
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x] === frequency) {
        antennas.push({ x, y });
      }
    }
  }
  return antennas;
}

// Part One: Calculate antinodes considering distance and alignment
function calculateAntinodesPartOne(
  antennas: Point[],
  width: number,
  height: number
): Set<string> {
  const antinodes = new Set<string>();

  for (let i = 0; i < antennas.length; i++) {
    for (let j = 0; j < antennas.length; j++) {
      if (i === j) continue;

      const a = antennas[i];
      const b = antennas[j];

      // Check if one antenna is twice as far as the other
      const dx = b.x - a.x;
      const dy = b.y - a.y;

      const midpoint = { x: a.x + dx / 2, y: a.y + dy / 2 };
      if (
        Number.isInteger(midpoint.x) &&
        Number.isInteger(midpoint.y) &&
        midpoint.x >= 0 &&
        midpoint.x < width &&
        midpoint.y >= 0 &&
        midpoint.y < height
      ) {
        antinodes.add(`${midpoint.x},${midpoint.y}`);
      }

      // Add extrapolated antinodes
      const extrapolated1 = { x: a.x - dx, y: a.y - dy };
      const extrapolated2 = { x: b.x + dx, y: b.y + dy };

      if (
        extrapolated1.x >= 0 &&
        extrapolated1.x < width &&
        extrapolated1.y >= 0 &&
        extrapolated1.y < height
      ) {
        antinodes.add(`${extrapolated1.x},${extrapolated1.y}`);
      }
      if (
        extrapolated2.x >= 0 &&
        extrapolated2.x < width &&
        extrapolated2.y >= 0 &&
        extrapolated2.y < height
      ) {
        antinodes.add(`${extrapolated2.x},${extrapolated2.y}`);
      }
    }
  }

  return antinodes;
}

// Part Two: Calculate antinodes considering resonant harmonics
function calculateAntinodesPartTwo(antennas: Point[], width: number, height: number): Set<string> {
  const antinodes = new Set<string>();

  // Add all antennas as potential antinodes
  for (const antenna of antennas) {
    antinodes.add(`${antenna.x},${antenna.y}`);
  }

  for (let i = 0; i < antennas.length; i++) {
    for (let j = i + 1; j < antennas.length; j++) {
      const a = antennas[i];
      const b = antennas[j];

      // Generate all points along the line connecting a and b
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const gcd = (x: number, y: number): number => (!y ? Math.abs(x) : gcd(y, x % y));
      const stepX = dx / gcd(dx, dy);
      const stepY = dy / gcd(dx, dy);

      let x = a.x;
      let y = a.y;
      while (x >= 0 && x < width && y >= 0 && y < height) {
        antinodes.add(`${x},${y}`);
        x += stepX;
        y += stepY;
      }

      x = b.x;
      y = b.y;
      while (x >= 0 && x < width && y >= 0 && y < height) {
        antinodes.add(`${x},${y}`);
        x -= stepX;
        y -= stepY;
      }
    }
  }

  return antinodes;
}

// Main function to calculate unique antinodes for Part One and Part Two
function calculateUniqueAntinodes(map: string[], part: number): number {
  const width = map[0].length;
  const height = map.length;

  const frequencies = new Set<string>();
  for (const row of map) {
    for (const char of row) {
      if (char !== ".") {
        frequencies.add(char);
      }
    }
  }

  const uniqueAntinodes = new Set<string>();
  for (const frequency of frequencies) {
    const antennas = findAntennas(map, frequency);

    let antinodes: Set<string>;
    if (part === 1) {
      antinodes = calculateAntinodesPartOne(antennas, width, height);
    } else {
      antinodes = calculateAntinodesPartTwo(antennas, width, height);
    }

    for (const antinode of antinodes) {
      uniqueAntinodes.add(antinode);
    }
  }

  return uniqueAntinodes.size;
}

// Read the input map from a file
const inputFilePath = "./input.txt";
const map = fs.readFileSync(inputFilePath, "utf-8").trim().split("\n");

// Calculate and print results for Part One and Part Two
console.log("Part One Result:");
const partOneResult = calculateUniqueAntinodes(map, 1);
console.log(`Unique Antinode Locations (Part One): ${partOneResult}`);

console.log("\nPart Two Result:");
const partTwoResult = calculateUniqueAntinodes(map, 2);
console.log(`Unique Antinode Locations (Part Two): ${partTwoResult}`);


import { isMainThread, parentPort, workerData } from "node:worker_threads";

import assert from "assert";


export function lines(input: string) {
    return input
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
  }

export enum Direction {
  N,
  E,
  S,
  W,
  NE,
  SE,
  SW,
  NW,
}

export const DIRECTIONS = [
  Direction.N,
  Direction.E,
  Direction.S,
  Direction.W,
  Direction.NE,
  Direction.SE,
  Direction.SW,
  Direction.NW,
];
assert(new Set(DIRECTIONS).size === 8, "there are 8 unique directions");

export interface Difference {
  x: number;
  y: number;
}

export function difference(direction: Direction): Difference {
  switch (direction) {
    case Direction.N:
      return { x: 0, y: -1 };
    case Direction.E:
      return { x: 1, y: 0 };
    case Direction.S:
      return { x: 0, y: 1 };
    case Direction.W:
      return { x: -1, y: 0 };
    case Direction.NE:
      return { x: 1, y: -1 };
    case Direction.SE:
      return { x: 1, y: 1 };
    case Direction.SW:
      return { x: -1, y: 1 };
    case Direction.NW:
      return { x: -1, y: -1 };
    default:
      const _exhaust: never = direction;
      _exhaust;
      throw new Error("Impossible code path");
  }
}

export class Grid {
  private _chars: string[][];

  constructor(input: string) {
    this._chars = lines(input).map((line: string): string[] =>
        line
            .split("")
            .map((c: string): string => c.trim())
            .filter((c: string): boolean => c.length > 0),
    );
    const lineLength = new Set(this._chars.map((l) => l.length));
    assert(lineLength.size === 1, "every line should have the same length");
  }

  public at(x: number, y: number): string | null {
    return this._chars[y]?.[x] ?? null;
  }

  public set(x: number, y: number, symbol: string): void {
    if ((this._chars[y]?.[x] ?? null) === null) {
      throw new RangeError(`${x}:${y} is not a valid position on the grid`);
    }
    this._chars[y][x] = symbol;
  }

  public get width() {
    return this._chars[0].length;
  }

  public get height() {
    return this._chars.length;
  }

  public clone(): Grid {
    return new Grid(this._chars.map((line) => line.join("")).join("\n"));
  }
}

export interface Point {
  x: number;
  y: number;
}

export interface WorkerData {
  input: string;
  batch: Point[];
}

export function key(point: Point): string {
  return `${point.x}:${point.y}`;
}

export function directionalKey(point: Point, direction: Direction): string {
  return `${point.x}:${point.y}:${direction}`;
}

export function placeObstacle(grid: Grid, x: number, y: number) {
  const copy = grid.clone();
  copy.set(x, y, "#");
  return copy;
}

export function findOnGrid(grid: Grid, symbol: string): Point | null {
  for (let x = 0; x < grid.width; ++x) {
    for (let y = 0; y < grid.height; ++y) {
      if (grid.at(x, y) === symbol) {
        return { x, y };
      }
    }
  }

  return null;
}

export function isOnGrid(grid: Grid, point: Point): boolean {
  return (
    point.x >= 0 &&
    point.y >= 0 &&
    point.x < grid.width &&
    point.y < grid.height
  );
}

export function rotate(direction: Direction): Direction {
  switch (direction) {
    case Direction.N:
      return Direction.E;
    case Direction.E:
      return Direction.S;
    case Direction.S:
      return Direction.W;
    case Direction.W:
      return Direction.N;
    default:
      throw new TypeError(
        `Unsupported direction: Direction.${Direction[direction]}`,
      );
  }
}

export function isInfiniteLoop(grid: Grid) {
  const visited = new Set<string>();
  let guard = findOnGrid(grid, "^");
  let currentDirection = Direction.N;

  if (!guard) {
    throw new Error("didn't find a guard");
  }

  while (isOnGrid(grid, guard)) {
    const dkey = directionalKey(guard, currentDirection);
    if (visited.has(dkey)) {
      return true;
    }
    visited.add(dkey);
    let diff = difference(currentDirection);
    let next: Point = {
      x: guard.x + diff.x,
      y: guard.y + diff.y,
    };
    if (grid.at(next.x, next.y) === "#") {
      currentDirection = rotate(currentDirection);
    } else {
      guard = next;
    }
  }

  return false;
}

function main() {
  if (isMainThread) {
    throw new Error("Supposed to only be ran as a worker");
  }

  const wd: WorkerData = workerData;
  const grid = new Grid(wd.input);

  let result = 0;

  for (const point of wd.batch) {
    if (grid.at(point.x, point.y) !== ".") {
      continue;
    }
    let newGrid = placeObstacle(grid, point.x, point.y);
    if (isInfiniteLoop(newGrid)) {
      result += 1;
    }
  }

  parentPort?.postMessage(result);
}

main();
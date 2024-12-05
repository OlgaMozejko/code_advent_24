import * as fs from 'fs';

type Rule = [number, number];
type Update = number[];

function parseInput(input: string): { rules: Rule[]; updates: Update[] } {
    const [rulesSection, updatesSection] = input.trim().split("\n\n");

    const rules = rulesSection.split("\n").map(rule => {
        const [X, Y] = rule.split("|").map(Number);
        return [X, Y] as Rule;
    });

    const updates = updatesSection.split("\n").map(update =>
        update.split(",").map(Number)
    );

    return { rules, updates };
}

function isValidUpdate(update: Update, rules: Rule[]): boolean {
    for (const [X, Y] of rules) {
        const xIndex = update.indexOf(X);
        const yIndex = update.indexOf(Y);
        if (xIndex !== -1 && yIndex !== -1 && xIndex > yIndex) {
            return false;
        }
    }
    return true;
}

function reorderUpdate(update: Update, rules: Rule[]): Update {
    const dependencyGraph: Map<number, Set<number>> = new Map();

    for (const page of update) {
        dependencyGraph.set(page, new Set());
    }

    for (const [X, Y] of rules) {
        if (update.includes(X) && update.includes(Y)) {
            dependencyGraph.get(Y)!.add(X);
        }
    }

    const visited = new Set<number>();
    const result: number[] = [];

    function visit(page: number) {
        if (visited.has(page)) return;
        visited.add(page);

        for (const dependency of Array.from(dependencyGraph.get(page)!)) {
            visit(dependency);
        }

        result.push(page);
    }

    for (const page of update) {
        visit(page);
    }

    return result.reverse();
}


function getMiddlePage(update: Update): number {
    const middleIndex = Math.floor(update.length / 2);
    return update[middleIndex];
}

function calculateMiddleSumForValidUpdates(input: string): number {
    const { rules, updates } = parseInput(input);

    let middleSum = 0;

    for (const update of updates) {
        if (isValidUpdate(update, rules)) {
            middleSum += getMiddlePage(update);
        }
    }

    return middleSum;
}

function calculateMiddleSumForReorderedUpdates(input: string): number {
    const { rules, updates } = parseInput(input);

    let middleSum = 0;

    for (const update of updates) {
        if (!isValidUpdate(update, rules)) {
            const reordered = reorderUpdate(update, rules);
            middleSum += getMiddlePage(reordered);
        }
    }

    return middleSum;
}

function main() {
    const inputFile = 'input.txt';
    const input = fs.readFileSync(inputFile, 'utf-8');

    const partOneResult = calculateMiddleSumForValidUpdates(input);
    console.log(`Part One: ${partOneResult}`);

    const partTwoResult = calculateMiddleSumForReorderedUpdates(input);
    console.log(`Part Two: ${partTwoResult}`);
}

main();

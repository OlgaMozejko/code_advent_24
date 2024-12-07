import * as fs from "fs";

// Part One Functions
function evaluateCombinations(
  numbers: number[],
  target: number,
  index: number = 1,
  currentResult: number = numbers[0]
): boolean {
  if (index === numbers.length) {
    return currentResult === target;
  }

  // Try adding the next number
  if (evaluateCombinations(numbers, target, index + 1, currentResult + numbers[index])) {
    return true;
  }

  // Try multiplying the next number
  if (evaluateCombinations(numbers, target, index + 1, currentResult * numbers[index])) {
    return true;
  }

  return false;
}

function calculateCalibrationResult(filePath: string): number {
  const input = fs.readFileSync(filePath, "utf-8").trim();
  const lines = input.split("\n");
  let totalResult = 0;

  for (const line of lines) {
    if (!line.trim() || !line.includes(":")) {
      console.warn(`Skipping invalid line: "${line}"`);
      continue;
    }

    const [targetStr, numbersStr] = line.split(": ");
    if (!targetStr || !numbersStr) {
      console.warn(`Skipping invalid line: "${line}"`);
      continue;
    }

    const target = parseInt(targetStr, 10);
    const numbers = numbersStr.split(" ").map(Number);

    if (evaluateCombinations(numbers, target)) {
      totalResult += target;
    }
  }

  return totalResult;
}

// Part Two Functions
function evaluateCombinationsWithConcat(
  numbers: number[],
  target: number,
  index: number = 1,
  currentResult: number = numbers[0]
): boolean {
  if (index === numbers.length) {
    return currentResult === target;
  }

  // Try addition
  if (evaluateCombinationsWithConcat(numbers, target, index + 1, currentResult + numbers[index])) {
    return true;
  }

  // Try multiplication
  if (evaluateCombinationsWithConcat(numbers, target, index + 1, currentResult * numbers[index])) {
    return true;
  }

  // Try concatenation
  const concatenated = parseInt(`${currentResult}${numbers[index]}`);
  if (evaluateCombinationsWithConcat(numbers, target, index + 1, concatenated)) {
    return true;
  }

  return false;
}

function calculateCalibrationResultWithConcat(filePath: string): number {
  const input = fs.readFileSync(filePath, "utf-8").trim();
  const lines = input.split("\n");
  let totalResult = 0;

  for (const line of lines) {
    if (!line.trim() || !line.includes(":")) {
      console.warn(`Skipping invalid line: "${line}"`);
      continue;
    }

    const [targetStr, numbersStr] = line.split(": ");
    if (!targetStr || !numbersStr) {
      console.warn(`Skipping invalid line: "${line}"`);
      continue;
    }

    const target = parseInt(targetStr, 10);
    const numbers = numbersStr.split(" ").map(Number);

    if (evaluateCombinationsWithConcat(numbers, target)) {
      totalResult += target;
    }
  }

  return totalResult;
}

// Specify the path to the input file
const inputFilePath = "./input.txt";

try {
  console.log("Part One Result:");
  const partOneResult = calculateCalibrationResult(inputFilePath);
  console.log(`Total Calibration Result (Part One): ${partOneResult}`);

  console.log("\nPart Two Result:");
  const partTwoResult = calculateCalibrationResultWithConcat(inputFilePath);
  console.log(`Total Calibration Result (Part Two): ${partTwoResult}`);
} catch (error) {
  if (error instanceof Error) {
    console.error("An error occurred:", error.message);
  } else {
    console.error("An unknown error occurred.");
  }
}

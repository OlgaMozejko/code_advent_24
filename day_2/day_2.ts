import * as fs from 'fs';


function parseInput(filePath: string): number[][] {
  const data = fs.readFileSync(filePath, 'utf-8').trim();
  return data.split('\n').map(line => line.split(/\s+/).map(Number));
}


function isSafeReport(levels: number[]): boolean {
  const isIncreasing = levels.every((val, idx) => idx === 0 || val > levels[idx - 1]);
  const isDecreasing = levels.every((val, idx) => idx === 0 || val < levels[idx - 1]);

  if (!isIncreasing && !isDecreasing) {
    return false;
  }

  return levels.every((val, idx) => {
    if (idx === 0) return true;
    const diff = Math.abs(val - levels[idx - 1]);
    return diff >= 1 && diff <= 3;
  });
}


function canBeMadeSafe(levels: number[]): boolean {
  for (let i = 0; i < levels.length; i++) {
    const modifiedLevels = levels.slice(0, i).concat(levels.slice(i + 1));
    if (isSafeReport(modifiedLevels)) {
      return true;
    }
  }
  return false;
}


function main() {
  const filePath = './input.txt'; 
  const reports = parseInput(filePath);


  const safeReportsCount = reports.filter(isSafeReport).length;

  const safeOrFixableReportsCount = reports.filter(report => isSafeReport(report) || canBeMadeSafe(report)).length;

  console.log('Safe Reports :', safeReportsCount);
  console.log('Safe or Fixable Reports :', safeOrFixableReportsCount);
}

main();

import * as fs from 'fs';

function parseInput(filePath: string): { leftList: number[]; rightList: number[] } {
  const data = fs.readFileSync(filePath, 'utf-8').trim();
  const leftList: number[] = [];
  const rightList: number[] = [];

  for (const line of data.split('\n')) {
    const [left, right] = line.split(/\s+/).map(Number);
    leftList.push(left);
    rightList.push(right);
  }

  return { leftList, rightList };
}


function calculateTotalDistance(leftList: number[], rightList: number[]): number {

  const sortedLeft = [...leftList].sort((a, b) => a - b);
  const sortedRight = [...rightList].sort((a, b) => a - b);


  let totalDistance = 0;
  for (let i = 0; i < sortedLeft.length; i++) {
    totalDistance += Math.abs(sortedLeft[i] - sortedRight[i]);
  }

  return totalDistance;
}


function calculateSimilarityScore(leftList: number[], rightList: number[]): number {
  const rightFrequency: Record<number, number> = {};


  for (const num of rightList) {
    rightFrequency[num] = (rightFrequency[num] || 0) + 1;
  }

 
  let similarityScore = 0;
  for (const num of leftList) {
    if (rightFrequency[num]) {
      similarityScore += num * rightFrequency[num];
    }
  }

  return similarityScore;
}


function main() {
  const filePath = './input.txt'; 
  const { leftList, rightList } = parseInput(filePath);


  const totalDistance = calculateTotalDistance(leftList, rightList);
  const similarityScore = calculateSimilarityScore(leftList, rightList);


  console.log('Total Distance :', totalDistance);
  console.log('Similarity Score :', similarityScore);
}

main();

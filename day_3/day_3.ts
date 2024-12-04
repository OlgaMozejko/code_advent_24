import * as fs from 'fs';

function parseInstructions(memory: string): { resultPart1: number; resultPart2: number } {
  const mulRegex = /mul\((\d+),(\d+)\)/g;
  const doRegex = /do\(\)/g;
  const dontRegex = /don't\(\)/g;

  let resultPart1 = 0;
  let resultPart2 = 0;

  let isEnabled = true;

  const tokens = memory.split(/(?=mul\()|(?=do\(\))|(?=don't\(\))/);

  for (const token of tokens) {
    if (doRegex.test(token)) {
      isEnabled = true; 
    } else if (dontRegex.test(token)) {
      isEnabled = false; 
    } else {
      const match = mulRegex.exec(token);
      if (match) {
        const x = parseInt(match[1], 10);
        const y = parseInt(match[2], 10);
        const product = x * y;

        resultPart1 += product;

        if (isEnabled) {
          resultPart2 += product;
        }
      }
    }
  }

  return { resultPart1, resultPart2 };
}

function main() {
  const filePath = './input.txt';
  const memory = fs.readFileSync(filePath, 'utf-8').trim();

  const { resultPart1, resultPart2 } = parseInstructions(memory);

  console.log('Sum of Valid Multiplications :', resultPart1);
  console.log('Sum of Enabled Multiplications :', resultPart2);
}

main();

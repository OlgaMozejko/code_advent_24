import * as fs from "fs";

// Parse the input into file and free space blocks
function parseDiskMap(diskMap: string): string[] {
  const blocks: string[] = [];
  let fileId = 0;

  for (let i = 0; i < diskMap.length; i += 2) {
    const fileLength = parseInt(diskMap[i], 10);
    const spaceLength = parseInt(diskMap[i + 1], 10);

    // Add file blocks
    for (let j = 0; j < fileLength; j++) {
      blocks.push(fileId.toString());
    }

    // Add free space blocks
    for (let j = 0; j < spaceLength; j++) {
      blocks.push(".");
    }

    if (fileLength > 0) {
      fileId++;
    }
  }

  fs.writeFileSync("parsed_blocks.txt", blocks.join(""), "utf-8");
  console.log("Step 1: Parsed blocks saved to 'parsed_blocks.txt'.");
  return blocks;
}

// Compact the disk by moving all file blocks left
function compactDisk(blocks: string[]): string[] {
  let writeIndex = 0;

  for (const block of blocks) {
    if (block !== ".") {
      blocks[writeIndex] = block;
      writeIndex++;
    }
  }

  // Fill the rest of the blocks with free spaces
  for (let i = writeIndex; i < blocks.length; i++) {
    blocks[i] = ".";
  }

  fs.writeFileSync("compacted_blocks.txt", blocks.join(""), "utf-8");
  console.log("Step 2: Compacted blocks saved to 'compacted_blocks.txt'.");
  return blocks;
}

// Calculate the checksum
function calculateChecksum(blocks: string[]): number {
  let checksum = 0;

  blocks.forEach((block, position) => {
    if (block !== ".") {
      checksum += position * parseInt(block, 10);
    }
  });

  return checksum;
}

// Main function
function main() {
  const inputFilePath = "./input.txt";

  try {
    const diskMap = fs.readFileSync(inputFilePath, "utf-8").trim();
    const parsedBlocks = parseDiskMap(diskMap);

    const compactedBlocks = compactDisk(parsedBlocks);

    const checksum = calculateChecksum(compactedBlocks);
    console.log(`Step 3: Filesystem Checksum: ${checksum}`);
  } catch (error) {
    console.error("Error:", error);
  }
}

main();

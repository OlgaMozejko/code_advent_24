def parse_disk_map(disk_map):
    """
    Parse the input disk map into a list of tuples representing (file size, free space size).
    """
    blocks = []
    for i in range(0, len(disk_map) - 1, 2):
        blocks.append((int(disk_map[i]), int(disk_map[i + 1])))
    return blocks


def simulate_compacting(blocks):
    """
    Simulate the compacting process where file blocks are moved leftward to fill gaps.
    Returns the final compacted block arrangement as a list of IDs.
    """
    block_arrangement = []
    for file_id, (file_size, space_size) in enumerate(blocks):
        block_arrangement.extend([file_id] * file_size + ["."] * space_size)

    compacted_blocks = [b for b in block_arrangement if b != "."]
    return compacted_blocks


def calculate_checksum(compacted_blocks):
    """
    Calculate the checksum by summing the product of block position and ID.
    """
    checksum = sum(i * block for i, block in enumerate(compacted_blocks))
    return checksum


# Input disk map (replace with the actual input from Advent of Code)
with open("input.txt", "r", encoding="utf-8-sig") as f:
    disk_map = f.read().strip()

# Step 1: Parse the disk map
parsed_blocks = parse_disk_map(disk_map)

# Step 2: Simulate compacting
compacted_blocks = simulate_compacting(parsed_blocks)

# Step 3: Calculate checksum
checksum = calculate_checksum(compacted_blocks)

print(f"Filesystem Checksum: {checksum}")

from collections import Counter

def compute_total_distance_and_similarity_score(file_path):
    left_list = []
    right_list = []
    
    # Read and process the file line by line
    with open(file_path, 'r', encoding='utf-8-sig') as file:
        for line in file:
            if line.strip():  # Skip empty lines
                left, right = map(int, line.split())
                left_list.append(left)
                right_list.append(right)
    
    # Sort both lists for total distance calculation
    left_list_sorted = sorted(left_list)
    right_list_sorted = sorted(right_list)
    total_distance = sum(abs(l - r) for l, r in zip(left_list_sorted, right_list_sorted))
    
    # Count occurrences in the right list for similarity score
    right_count = Counter(right_list)
    similarity_score = sum(num * right_count[num] for num in left_list)
    
    return total_distance, similarity_score


file_path = './input.txt'
total_distance, similarity_score = compute_total_distance_and_similarity_score(file_path)

# Print the results
print("Total distance:", total_distance)
print("Similarity score:", similarity_score)

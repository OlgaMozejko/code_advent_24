def is_safe(report):
    """
    Determine if a single report is safe.
    """
    differences = [report[i+1] - report[i] for i in range(len(report) - 1)]
    
    # Check if all differences are between -3 and -1 (decreasing)
    if all(-3 <= diff <= -1 for diff in differences):
        return True
    
    # Check if all differences are between 1 and 3 (increasing)
    if all(1 <= diff <= 3 for diff in differences):
        return True
    
    return False

def can_be_safe_with_dampener(report):
    """
    Check if removing one level can make the report safe.
    """
    for i in range(len(report)):
        modified_report = report[:i] + report[i+1:]  # Remove one level
        if is_safe(modified_report):
            return True
    return False

def analyze_reports(file_path):
    """
    Analyze reports and return both the number of safe reports and those made safe with the dampener.
    """
    safe_count = 0
    safe_with_dampener_count = 0
    
    with open(file_path, 'r', encoding='utf-8-sig') as file:
        for line in file:
            if line.strip():  # Skip empty lines
                report = list(map(int, line.split()))
                
                # Check if the report is safe
                if is_safe(report):
                    safe_count += 1
                    safe_with_dampener_count += 1
                # Check if it can be made safe with the dampener
                elif can_be_safe_with_dampener(report):
                    safe_with_dampener_count += 1
    
    return safe_count, safe_with_dampener_count


file_path = './input.txt'

# Run the analysis
safe_reports, safe_reports_with_dampener = analyze_reports(file_path)

# Print the results
print("Number of safe reports without Problem Dampener:", safe_reports)
print("Number of safe reports with Problem Dampener:", safe_reports_with_dampener)

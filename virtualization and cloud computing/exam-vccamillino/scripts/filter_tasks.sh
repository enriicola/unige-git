#!/bin/bash
# Script to filter a text file, keeping only lines that start with "TASK"
# and stopping when encountering a line that starts with "PLAY RECAP"

# Check if input file is provided
if [ $# -eq 0 ]; then
    echo "Usage: $0 <input_file> [output_file]"
    echo "  input_file: Path to the text file to filter"
    echo "  output_file: Optional output file (if not provided, input file will be overwritten)"
    exit 1
fi

INPUT_FILE="$1"
OUTPUT_FILE="${2:-$INPUT_FILE}"

# Check if input file exists
if [ ! -f "$INPUT_FILE" ]; then
    echo "Error: File '$INPUT_FILE' not found"
    exit 1
fi

# Create temporary file for processing
TEMP_FILE=$(mktemp)

# Process the file
while IFS= read -r line; do
    # Stop if line starts with "PLAY RECAP"
    if [[ "$line" =~ ^[[:space:]]*"PLAY RECAP" ]]; then
        break
    fi
    
    # Keep lines that start with "TASK" and remove all "*" characters
    if [[ "$line" =~ ^[[:space:]]*"TASK" ]]; then
        # Remove all "*" characters from the line
        cleaned_line="${line//\*/}"
        echo "$cleaned_line" >> "$TEMP_FILE"
    fi
done < "$INPUT_FILE"

# Move temp file to output location
mv "$TEMP_FILE" "$OUTPUT_FILE"

# Count lines and report
LINE_COUNT=$(wc -l < "$OUTPUT_FILE")
echo "Filtered $LINE_COUNT TASK lines from $INPUT_FILE"

if [ "$OUTPUT_FILE" != "$INPUT_FILE" ]; then
    echo "Results saved to $OUTPUT_FILE"
else
    echo "Original file $INPUT_FILE has been updated"
fi

export interface ParsedCSVData {
  headers: string[];
  rows: Record<string, string>[];
}

export function parseCSV(csvText: string): ParsedCSVData {
  if (!csvText || csvText.trim() === "") {
    return { headers: [], rows: [] };
  }

  const lines = csvText.trim().split(/\r\n|\n/);
  if (lines.length === 0) {
    return { headers: [], rows: [] };
  }

  // More robust CSV line splitting, handling commas within quotes
  const splitCsvLine = (line: string): string[] => {
    const result: string[] = [];
    let currentField = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
        // Handle double quotes inside quoted field as a single quote
        if (i + 1 < line.length && line[i+1] === '"') {
          currentField += '"';
          i++; // Skip next quote
        }
      } else if (char === ',' && !inQuotes) {
        result.push(currentField.trim());
        currentField = '';
      } else {
        currentField += char;
      }
    }
    result.push(currentField.trim()); // Add the last field
    return result;
  };
  
  const headers = splitCsvLine(lines[0]);
  const rows: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === "") continue; // Skip empty lines
    const values = splitCsvLine(lines[i]);
    const row: Record<string, string> = {};
    headers.forEach((header, index) => {
      row[header] = values[index] !== undefined ? values[index] : "";
    });
    rows.push(row);
  }

  return { headers, rows };
}

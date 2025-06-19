# AERA Abstract Scraper - ALL Pages (UTF-8 Fixed)

A Tampermonkey userscript that scrapes all session abstracts and paper details from the AERA Annual Meeting online program across all paginated results and outputs a clean UTF-8 encoded CSV file.

---

## Features

- Automatically navigates through all session list pages
- Extracts:
  - Session Title
  - Date & Time
  - Location
  - Paper Titles
  - Abstracts
- Handles sessions with multiple papers
- Outputs a UTF-8 CSV with proper encoding (safe for Excel)
- Throttles requests to prevent overloading the server

---

## Installation

1. Install [Tampermonkey](https://www.tampermonkey.net/) on your browser (Chrome, Firefox, Edge).
2. Create a new script in Tampermonkey.
3. Paste in the contents of `aera-abstract-scraper.js`.
4. Save the script.
5. Navigate to the AERA online program search page:  
   https://convention2.allacademic.com/one/aera/aera25/index.php?cmd=Online+Program+Search

---

## Usage

1. Start on any AERA session search results page.
2. The script will:
   - Automatically begin scraping after 3 seconds
   - Visit each session on the page
   - Visit each paper under each session
   - Extract all relevant information
   - Proceed to the next results page
3. Once completed, a file named `aera_all_abstracts.csv` will download automatically.

---

## Output Format (CSV Columns)

| Session Title | Time | Place | Paper Title | Abstract |
|---------------|------|-------|-------------|----------|

---

## Notes

- Keep the browser tab open and focused while scraping.
- The scraping process may take several minutes depending on the number of sessions and papers.
- The script includes a UTF-8 BOM prefix (`\uFEFF`) to ensure compatibility with Excel.

---

## License

MIT License

---

## Author

Created by Saurav Dhakal 
For academic and research use.

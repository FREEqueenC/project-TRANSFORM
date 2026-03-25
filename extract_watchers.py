import fitz
import re
import os

pdf_path = os.path.expanduser('~/Downloads/The Books of Jeu and the Untitled Text in the Bruce Codex.pdf')
doc = fitz.open(pdf_path)
text = chr(10).join([page.get_text() for page in doc])

# Look for patterns of the watchers or seals
# Examples: "MNOZANIOJOO", or repeated letters, or the word "watcher"
results = []
watcher_matches = re.finditer(r'(.{0,100}watcher.{0,100})', text, re.IGNORECASE)
for m in watcher_matches:
    results.append("WATCHER MATCH: " + m.group(1).replace('\n', ' '))
    
seal_matches = re.finditer(r'(.{0,100}treasury.{0,100})', text, re.IGNORECASE)
for m in seal_matches:
    results.append("TREASURY MATCH: " + m.group(1).replace('\n', ' '))
    
cipher_matches = re.finditer(r'([A-Z]{5,})', text)
for m in cipher_matches:
    results.append("CIPHER: " + m.group(1).replace('\n', ' '))

with open('watchers.txt', 'w', encoding='utf-8') as f:
    for r in results:
        f.write(r + '\n')

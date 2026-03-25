import fitz
import re
import os

pdf_paths = [
    r'C:\Users\Ashle\Downloads\Quantum_Cymatics__Revealing_Electron_Resonance_Geometry_v1_8.pdf',
    r'C:\Users\Ashle\Downloads\CHAP12.pdf',
    r'C:\Users\Ashle\Downloads\Lect21.pdf'
]

patterns = [
    r'(.{0,100}TM010.{0,100})',
    r'(.{0,100}2\.405.{0,100})',
    r'(.{0,100}frequency.{0,100})',
    r'(.{0,100}cymatics.{0,100})'
]

results = []

for path in pdf_paths:
    if not os.path.exists(path):
        results.append(f"File not found: {path}")
        continue
        
    try:
        doc = fitz.open(path)
        text = chr(10).join([page.get_text() for page in doc])
        
        results.append(f"\n--- Results for {os.path.basename(path)} ---")
        
        for pattern in patterns[:2]: # Focus mainly on TM010 and 2.405 first
            matches = list(re.finditer(pattern, text, re.IGNORECASE | re.DOTALL))
            results.append(f"Pattern {pattern}: {len(matches)} matches")
            for m in matches[:5]: # limit to 5 matches
                clean_text = m.group(1).replace('\n', ' ').strip()
                results.append(f"  > {clean_text}")
    except Exception as e:
        results.append(f"Error reading {path}: {str(e)}")

with open('physics_research.txt', 'w', encoding='utf-8') as f:
    f.write('\n'.join(results))

print("Research written to physics_research.txt")

import re
import json

with open('src/data/products.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Match each product object block
blocks = re.findall(r'\{\s*id:\s*[\'"]([^\'"]+)[\'"].*?slug:\s*[\'"]([^\'"]+)[\'"].*?name:\s*[\'"]([^\'"]+)[\'"].*?category:\s*[\'"]([^\'"]+)[\'"]', content, re.DOTALL)

print(f"Total products matched: {len(blocks)}")
for b in blocks:
    print(f"{b[3]:15} | {b[1]:38} | {b[2]}")

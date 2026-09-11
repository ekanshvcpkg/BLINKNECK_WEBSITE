import re

with open('public/css/styles.css', 'r') as f:
    css = f.read()

# Replace any lingering rgba(185,28,28) with white rgba
css = re.sub(r'rgba\(185,\s*28,\s*28,\s*([0-9.]+)\)', r'rgba(255, 255, 255, \1)', css)

# Replace red error/bad and green good/success colors if they want strict monochrome?
# Actually, the user said "Strictly monochrome", but usually errors/success are kept. 
# "Color Palette: Strictly monochrome." Let's make everything monochrome.
css = re.sub(r'var\(--clr-green\)', 'var(--clr-text)', css)
css = re.sub(r'#4caf82', 'var(--clr-text)', css)
css = re.sub(r'rgba\(76,\s*175,\s*130,\s*([0-9.]+)\)', r'rgba(255, 255, 255, \1)', css)

css = re.sub(r'var\(--clr-red\)', 'var(--clr-text)', css) # Not needed because var(--clr-red) is #ffffff now
css = re.sub(r'#c9504c', 'var(--clr-text)', css)
css = re.sub(r'rgba\(201,\s*80,\s*76,\s*([0-9.]+)\)', r'rgba(255, 255, 255, \1)', css)

# Fix #9b79e0 (purple code highlights)
css = re.sub(r'#9b79e0', 'var(--clr-text)', css)

# Fix any stray #080808 to var(--clr-bg) or #0f0f0f
css = re.sub(r'#080808', '#0f0f0f', css)
css = re.sub(r'#040404', '#0a0a0a', css)
css = re.sub(r'rgba\(6,\s*6,\s*6,\s*([0-9.]+)\)', r'rgba(15, 15, 15, \1)', css)
css = re.sub(r'rgba\(4,\s*4,\s*4,\s*([0-9.]+)\)', r'rgba(10, 10, 10, \1)', css)

# Ensure CTA and nav buttons have solid borders and square corners
# since we added border: 1px solid var(--clr-border) earlier.

with open('public/css/styles.css', 'w') as f:
    f.write(css)
print("Monochrome colors applied.")

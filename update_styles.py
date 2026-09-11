import re

with open('public/css/styles.css', 'r') as f:
    css = f.read()

# Update variables
css = re.sub(r'--clr-bg:\s*#[0-9a-fA-F]+;', '--clr-bg: #0f0f0f;', css)
css = re.sub(r'--clr-surface:\s*#[0-9a-fA-F]+;', '--clr-surface: #141414;', css)
css = re.sub(r'--clr-surface2:\s*#[0-9a-fA-F]+;', '--clr-surface2: #1a1a1a;', css)
css = re.sub(r'--clr-surface3:\s*#[0-9a-fA-F]+;', '--clr-surface3: #222222;', css)
css = re.sub(r'--clr-border:\s*#[0-9a-fA-F]+;', '--clr-border: #333333;', css)
css = re.sub(r'--clr-border-soft:\s*#[0-9a-fA-F]+;', '--clr-border-soft: #333333;', css)

# We map the old accent colors to white/monochrome
css = re.sub(r'--clr-red:\s*#[0-9a-fA-F]+;', '--clr-red: #ffffff;', css)
css = re.sub(r'--clr-red-light:\s*#[0-9a-fA-F]+;', '--clr-red-light: #cccccc;', css)
css = re.sub(r'--clr-red-dim:\s*rgba\([^)]+\);', '--clr-red-dim: rgba(255, 255, 255, 0.1);', css)

# Update text colors
css = re.sub(r'--clr-text:\s*#[0-9a-fA-F]+;', '--clr-text: #ededed;', css)
css = re.sub(r'--clr-text-dim:\s*#[0-9a-fA-F]+;', '--clr-text-dim: #888888;', css)
css = re.sub(r'--clr-text-muted:\s*#[0-9a-fA-F]+;', '--clr-text-muted: #555555;', css)

# Update fonts
css = re.sub(r"--font-display:\s*[^;]+;", "--font-display: 'JetBrains Mono', monospace;", css)
css = re.sub(r"--font-body:\s*[^;]+;", "--font-body: 'JetBrains Mono', monospace;", css)
css = re.sub(r"--font-ui:\s*[^;]+;", "--font-ui: 'JetBrains Mono', monospace;", css)

# Remove all box-shadow and border-radius
css = re.sub(r'\s*box-shadow:\s*[^;]+;', '', css)
css = re.sub(r'\s*border-radius:\s*[^;]+;', '', css)

# Remove gradients by replacing them with solid background colors
# For hero-bg, security-bg, cta-bg, etc.
css = re.sub(r'background:\s*radial-gradient\([^)]+\)\s*,[^;]+;', 'background: var(--clr-bg);', css)
css = re.sub(r'background:\s*radial-gradient\([^)]+\)\s*,[^;]+;', 'background: var(--clr-bg);', css) # In case there are multiple
css = re.sub(r'background-image:\s*linear-gradient\([^)]+\)\s*,\s*linear-gradient\([^)]+\);', 'background: transparent;', css)
css = re.sub(r'background:\s*radial-gradient\([^)]+\);', 'background: transparent;', css)
css = re.sub(r'background-image:\s*radial-gradient\([^)]+\);', 'background: transparent;', css)

# Remove masks
css = re.sub(r'\s*-webkit-mask-image:\s*[^;]+;', '', css)
css = re.sub(r'\s*mask-image:\s*[^;]+;', '', css)

with open('public/css/styles.css', 'w') as f:
    f.write(css)
print("Done")

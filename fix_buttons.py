import re

with open('public/css/styles.css', 'r') as f:
    css = f.read()

# Replace button backgrounds to use white explicitly
css = re.sub(r'\.btn-primary \{\n([^\}]+)background:\s*var\(--clr-[a-z-]+\);', r'.btn-primary {\n\1background: #ffffff;', css)
css = re.sub(r'\.nav-cta-btn \{\n([^\}]+)background:\s*var\(--clr-[a-z-]+\);', r'.nav-cta-btn {\n\1background: #ffffff;', css)
css = re.sub(r'\.mockup-btn \{\n([^\}]+)background:\s*var\(--clr-[a-z-]+\);', r'.mockup-btn {\n\1background: #ffffff;', css)
css = re.sub(r'\.form-submit \{\n([^\}]+)background:\s*var\(--clr-[a-z-]+\);', r'.form-submit {\n\1background: #ffffff;', css)

with open('public/css/styles.css', 'w') as f:
    f.write(css)
print("Button backgrounds fixed.")

import os
path = r"C:\Users\rhuan\.gemini\antigravity\scratch\revo-bot-site\style.css"
with open(path, 'r', encoding='utf-8') as f:
    css = f.read()

# Replace root variables
css = css.replace("--primary-red: #e60000;", "--primary-red: #ffffff;")
css = css.replace("--primary-red-glow: rgba(230, 0, 0, 0.4);", "--primary-red-glow: rgba(255, 255, 255, 0.4);")
css = css.replace("--secondary-red: #ff3333;", "--secondary-red: #d4d4d4;")
css = css.replace("--card-border: rgba(230, 0, 0, 0.1);", "--card-border: rgba(255, 255, 255, 0.1);")

# Update hardcoded rgb to white
css = css.replace("rgba(230, 0, 0,", "rgba(255, 255, 255,")

# Update glitch effects to grayscales instead of red/blue
css = css.replace("text-shadow: -2px 0 red;", "text-shadow: -2px 0 #555;")
css = css.replace("text-shadow: -2px 0 blue;", "text-shadow: -2px 0 #aaa;")

# Update button text colors to black since the background is now white/light
css = css.replace(
""".btn-nav:hover {
    background: var(--primary-red);
    color: white;""",
""".btn-nav:hover {
    background: var(--primary-red);
    color: black;"""
)

css = css.replace(
""".btn-primary {
    background: var(--primary-red);
    color: white;""",
""".btn-primary {
    background: var(--primary-red);
    color: black;"""
)

css = css.replace(
""".btn-download-massive {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    background: linear-gradient(135deg, var(--secondary-red), var(--primary-red));
    padding: 1.5rem 4rem;
    border-radius: 12px;
    font-size: 1.8rem;
    font-weight: 800;
    color: white;""",
""".btn-download-massive {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    background: linear-gradient(135deg, var(--secondary-red), var(--primary-red));
    padding: 1.5rem 4rem;
    border-radius: 12px;
    font-size: 1.8rem;
    font-weight: 800;
    color: black;"""
)

with open(path, 'w', encoding='utf-8') as f:
    f.write(css)

print("Theme updated successfully!")

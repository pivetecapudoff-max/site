import os

files = [
    r"C:\Users\rhuan\.gemini\antigravity\scratch\revo-bot-site\style.css",
    r"C:\Users\rhuan\.gemini\antigravity\scratch\revo-bot-site\index.html"
]

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    content = content.replace("rgba(220,20,60,", "rgba(255,255,255,")
    content = content.replace("rgba(220, 20, 60,", "rgba(255, 255, 255,")
    content = content.replace("#dc143c", "#ffffff")
    content = content.replace("#DC143C", "#ffffff")

    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)
print("Done")

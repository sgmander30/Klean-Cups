"""Builds a single-page preview of the site for publishing as a Claude Artifact.
Usage: python3 tools/build_preview.py OUT_DIR
Inlines css/style.css and the two scripts; images and videos are published alongside it."""
import re, sys, pathlib
root = pathlib.Path(__file__).resolve().parent.parent
out = pathlib.Path(sys.argv[1]); out.mkdir(parents=True, exist_ok=True)
html = (root / "index.html").read_text()
css = (root / "css/style.css").read_text()
js = (root / "js/config.js").read_text() + "\n" + (root / "js/app.js").read_text()
title = re.search(r"<title>.*?</title>", html).group(0)
fonts = re.search(r'<link rel="stylesheet" href="https://fonts[^>]+>', html).group(0)
body = re.search(r"<body>(.*)</body>", html, re.S).group(1)
body = re.sub(r'<script src="js/[^"]+"></script>\s*', "", body)
page = (f'{title}\n<meta name="claude:viewport-fit-sides" content="cover">\n{fonts}\n'
        f"<style>\n{css}\n</style>\n{body}\n<script>\n{js}\n</script>\n")
(out / "index.html").write_text(page)
print("wrote", out / "index.html", len(page), "bytes")

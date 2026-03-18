/**
 * Convert all .md files in docs/ to HTML in docs/html/
 * Preserves folder structure (en/, vi/, root)
 */
const fs = require('fs');
const path = require('path');

// Use dynamic import for ESM module
async function main() {
  const { marked } = await import('marked');
  const docsDir = path.join(__dirname, '..', 'docs');
  const htmlDir = path.join(docsDir, 'html');

  const htmlTemplate = (title, body) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; max-width: 800px; margin: 0 auto; padding: 2rem; line-height: 1.6; }
    h1, h2, h3 { color: #333; }
    pre { background: #f5f5f5; padding: 1rem; overflow-x: auto; border-radius: 4px; }
    code { background: #f5f5f5; padding: 0.2em 0.4em; border-radius: 3px; font-size: 0.9em; }
    pre code { background: none; padding: 0; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #ddd; padding: 0.5rem 0.75rem; text-align: left; }
    th { background: #f5f5f5; }
    a { color: #0066cc; }
  </style>
</head>
<body>
${body}
</body>
</html>`;

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function findMdFiles(dir, base = '') {
    const results = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
      if (e.name === 'html') continue; // skip output folder
      const rel = path.join(base, e.name);
      if (e.isDirectory()) {
        results.push(...findMdFiles(path.join(dir, e.name), rel));
      } else if (e.name.endsWith('.md')) {
        results.push(rel);
      }
    }
    return results;
  }

  const mdFiles = findMdFiles(docsDir);
  fs.mkdirSync(htmlDir, { recursive: true });

  for (const rel of mdFiles) {
    const mdPath = path.join(docsDir, rel);
    const htmlRel = rel.replace(/\.md$/, '.html');
    const htmlPath = path.join(htmlDir, htmlRel);
    const htmlSubDir = path.dirname(htmlPath);

    const md = fs.readFileSync(mdPath, 'utf8');
    const body = marked.parse(md);
    const title = path.basename(rel, '.md').replace(/-/g, ' ');
    const html = htmlTemplate(title, body);

    fs.mkdirSync(htmlSubDir, { recursive: true });
    fs.writeFileSync(htmlPath, html, 'utf8');
    console.log('Generated:', htmlRel);
  }

  console.log(`Done. ${mdFiles.length} files converted to docs/html/`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

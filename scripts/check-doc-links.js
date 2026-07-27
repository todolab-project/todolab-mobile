const fs = require('fs');
const path = require('path');

const MARKDOWN_LINK_PATTERN = /\[[^\]]*]\(([^)]+)\)/g;
const CHECKED_EXTENSIONS = new Set(['.md', '.ts', '.tsx']);
const SKIPPED_PREFIXES = ['http:', 'https:', 'mailto:', '../../../backend/', '../../backend/'];

function walkMarkdownFiles(directory, files = []) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      walkMarkdownFiles(fullPath, files);
    } else if (entry.name.endsWith('.md')) {
      files.push(fullPath);
    }
  }

  return files;
}

function shouldCheckLink(target) {
  if (!target) return false;
  if (SKIPPED_PREFIXES.some((prefix) => target.startsWith(prefix))) return false;

  return CHECKED_EXTENSIONS.has(path.extname(target.split('#')[0]));
}

function findMissingLinks(files) {
  const missing = [];

  for (const file of files) {
    const text = fs.readFileSync(file, 'utf8');

    for (const match of text.matchAll(MARKDOWN_LINK_PATTERN)) {
      const target = match[1].split('#')[0];
      if (!shouldCheckLink(target)) continue;

      const resolved = path.normalize(path.join(path.dirname(file), target));

      if (!fs.existsSync(resolved)) {
        missing.push(`${file} -> ${match[1]} (${resolved})`);
      }
    }
  }

  return missing;
}

const files = [...walkMarkdownFiles('docs'), 'README.md'];
const missing = findMissingLinks(files);

if (missing.length > 0) {
  console.error('Missing local markdown links:');
  console.error(missing.join('\n'));
  process.exit(1);
}

console.log('All local document/source markdown links exist.');

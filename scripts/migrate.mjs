#!/usr/bin/env node
/**
 * Migrate Jekyll posts to MDX.
 *
 * Usage: node scripts/migrate.mjs <path-to-jekyll-repo-or-_posts-dir>
 *
 * Handles:
 *  - date + slug extraction from Jekyll filenames (YYYY-MM-DD-slug.markdown)
 *  - {% highlight lang %} ... {% endhighlight %}  ->  fenced code blocks
 *  - inline <code>...</code>                       ->  `backticks`
 *  - {{ site.url }} in image/link paths            ->  removed (root-relative)
 *  - front matter normalization (title, date, category, tags, description)
 *  - warns about any leftover Liquid syntax that needs manual review
 */

import fs from "fs";
import path from "path";
import matter from "gray-matter";

const argDir = process.argv[2];
if (!argDir) {
  console.error("Usage: node scripts/migrate.mjs <jekyll-repo-or-_posts-dir>");
  process.exit(1);
}

let srcDir = path.resolve(argDir);
if (fs.existsSync(path.join(srcDir, "_posts"))) {
  srcDir = path.join(srcDir, "_posts");
}

const outDir = path.join(process.cwd(), "content", "posts");
fs.mkdirSync(outDir, { recursive: true });

function prettifyCategory(raw) {
  if (!raw) return "General";
  return String(raw)
    .split(/[-_\s]+/)
    .map((w) => (w.toLowerCase() === "gsoc" ? "GSoC" : /^\d+$/.test(w) ? w : w[0].toUpperCase() + w.slice(1)))
    .join(" ");
}

function firstParagraph(body) {
  const cleaned = body
    .replace(/```[\s\S]*?```/g, "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .trim();
  const para = cleaned.split(/\n\s*\n/)[0] ?? "";
  const text = para
    .replace(/\[([^\]]+)\]\[[^\]]*\]/g, "$1") // reference links
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1") // inline links
    .replace(/[*_`>#]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > 180 ? text.slice(0, 177).trimEnd() + "…" : text;
}

function transformBody(body) {
  let out = body;

  // {% highlight php startinline linenos %} -> ```php
  out = out.replace(
    /\{%\s*highlight\s+(\w+)[^%]*%\}/g,
    (_, lang) => "```" + lang.toLowerCase()
  );
  out = out.replace(/\{%\s*endhighlight\s*%\}/g, "```");

  // inline <code>..</code> -> `..` (single-line only)
  out = out.replace(/<code>([^<\n]*)<\/code>/g, (_, inner) => "`" + inner + "`");

  // {{ site.url }}/assets/... -> /assets/...
  out = out.replace(/\{\{\s*site\.url\s*\}\}/g, "");

  return out;
}

const files = fs
  .readdirSync(srcDir)
  .filter((f) => /\.(md|markdown)$/.test(f))
  .sort();

let migrated = 0;
const warnings = [];

for (const file of files) {
  const raw = fs.readFileSync(path.join(srcDir, file), "utf8");
  const { data, content } = matter(raw);

  const m = file.match(/^(\d{4}-\d{2}-\d{2})-(.+)\.(md|markdown)$/);
  const slug = m ? m[2] : file.replace(/\.(md|markdown)$/, "");
  const fmDate = data.date instanceof Date ? data.date.toISOString().slice(0, 10) : String(data.date ?? "").slice(0, 10);
  const date = /^\d{4}-\d{2}-\d{2}$/.test(fmDate) ? fmDate : m ? m[1] : "1970-01-01";

  if (data.draft === true || data.published === false) {
    warnings.push(`skipped draft: ${file}`);
    continue;
  }

  const body = transformBody(content).trim();

  // Flag leftover Liquid for manual review
  const leftover = body.match(/\{[%{][\s\S]*?[%}]\}/g);
  if (leftover) {
    warnings.push(`${slug}: leftover Liquid syntax needs manual review: ${leftover.slice(0, 3).join(" | ")}`);
  }

  const category = prettifyCategory(
    Array.isArray(data.categories) ? data.categories[0] : data.categories ?? data.category
  );
  const tags = Array.isArray(data.tags) ? data.tags : data.tags ? [data.tags] : [];
  const description = data.description ?? data.excerpt ?? firstParagraph(body);

  const fm = [
    "---",
    `title: ${JSON.stringify(data.title ?? slug)}`,
    `date: "${date}"`,
    `category: ${JSON.stringify(category)}`,
    `tags: [${tags.map((t) => JSON.stringify(String(t))).join(", ")}]`,
    `description: ${JSON.stringify(description)}`,
    "---",
    "",
  ].join("\n");

  fs.writeFileSync(path.join(outDir, `${slug}.mdx`), fm + body + "\n");
  migrated++;
  console.log(`✓ ${file} -> content/posts/${slug}.mdx`);
}

console.log(`\nMigrated ${migrated}/${files.length} posts.`);
if (warnings.length) {
  console.log("\nWarnings:");
  for (const w of warnings) console.log(`  ⚠ ${w}`);
}

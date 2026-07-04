# prateeksachan.com — Next.js blog

A Vercel-blog-style rebuild of the old Jekyll site: Next.js 15 (App Router) + MDX,
fully static, with all 13 posts already migrated into `content/posts/`.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (all pages pre-rendered)
```

## Structure

```
app/
  page.tsx            # blog index (featured post + card grid)
  blog/[slug]/        # post pages (MDX rendered with next-mdx-remote)
  about/              # migrated from about.md
  feed.xml/           # RSS feed (replaces Jekyll's feed.xml)
  tag/[tag]/          # tag pages at /tag/:tag (same URLs as the old site)
  archive/            # tag-grouped archive at /archive (same URL as before)
  globals.css         # design tokens: light/dark, Geist, Vercel-style cards
content/posts/        # your posts as .mdx — add new posts here
lib/posts.ts          # post loading, sorting, reading time
scripts/migrate.mjs   # the Jekyll -> MDX converter (already run)
```

## Writing a new post

Drop a file in `content/posts/my-post.mdx`:

```md
---
title: "My new post"
date: "2026-07-04"
category: "Search"
tags: [elasticsearch]
description: "One-line summary shown on cards and in RSS."
---

Content in Markdown/MDX. Fenced code blocks get syntax highlighting.
```

## Re-running the migration

```bash
npm run migrate -- /path/to/old/jekyll/repo
```

It converts `{% highlight %}` blocks to fenced code, `<code>` tags to backticks,
strips `{{ site.url }}`, normalizes front matter, and warns about anything
needing manual review.

## Two things to know

1. **Images**: two posts (`indexing-rich-documents-in-solr`,
   `global-search-prototype-v1-0`) reference images under `/assets/images/`
   that weren't in the git repo. Drop the originals into `public/assets/images/`
   and they'll work; until then those two posts show broken image links.
2. **Old URLs**: Jekyll served posts at `/:categories/:year/:month/:day/:title`;
   the new site uses `/blog/:slug`. If you care about old inbound links, add
   redirects in `next.config.mjs` or `vercel.json`. Tag pages kept their old
   `/tag/:tag` URLs (the old trailing-slash form redirects automatically).

## Deploying

Push to GitHub and import the repo at vercel.com/new — zero config needed.

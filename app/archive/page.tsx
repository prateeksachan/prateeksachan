import Link from "next/link";
import { getAllTags, getPostsByTag, formatDate } from "@/lib/posts";

export const metadata = {
  title: "Archive",
  description: "Archive sorted by tags.",
};

export default function Archive() {
  const tags = [...getAllTags()].sort((a, b) => a.tag.localeCompare(b.tag));

  return (
    <div className="container archive">
      <div className="page-head">
        <h1>Archive</h1>
        <p>Every post, sorted by tag.</p>
      </div>

      <div className="tag-row archive-cloud">
        {tags.map(({ tag, slug, count }) => (
          <a key={slug} href={`#${slug}`} className="tag">
            {tag} <span className="tag-count">{count}</span>
          </a>
        ))}
      </div>

      {tags.map(({ tag, slug }) => (
        <section key={slug} id={slug} className="archive-section">
          <h2>
            <Link href={`/tag/${slug}`}>{tag}</Link>
          </h2>
          <ul className="archive-list">
            {getPostsByTag(slug).map((post) => (
              <li key={post.slug}>
                <time dateTime={post.date}>{formatDate(post.date)}</time>
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

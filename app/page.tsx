import Link from "next/link";
import { getAllPosts, formatDate } from "@/lib/posts";

export default function Home() {
  const posts = getAllPosts();
  const [featured, ...rest] = posts;

  return (
    <div className="container">
      <div className="page-head">
        <h1>Blog</h1>
        <p>
          Writings on search systems, Elasticsearch, Solr, open source, and
          whatever else I&apos;m fiddling with.
        </p>
      </div>

      {featured && (
        <Link href={`/blog/${featured.slug}`} className="featured">
          <span className="eyebrow">{featured.category}</span>
          <h2>{featured.title}</h2>
          <p>{featured.description}</p>
          <span className="post-meta">
            <span>{formatDate(featured.date)}</span>
            <span>·</span>
            <span>{featured.readingTime}</span>
          </span>
        </Link>
      )}

      <div className="post-grid">
        {rest.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="post-card"
          >
            <span className="eyebrow">{post.category}</span>
            <h3>{post.title}</h3>
            <p>{post.description}</p>
            <span className="post-meta">
              <span>{formatDate(post.date)}</span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

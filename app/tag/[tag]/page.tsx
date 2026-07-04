import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllTags, getPostsByTag, formatDate } from "@/lib/posts";

export function generateStaticParams() {
  return getAllTags().map(({ slug }) => ({ tag: slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  return {
    title: `Posts tagged with ${tag}`,
    description: `All posts tagged with ${tag}.`,
  };
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const posts = getPostsByTag(tag);
  if (posts.length === 0) notFound();

  return (
    <div className="container">
      <div className="page-head">
        <span className="eyebrow">Tag</span>
        <h1>{tag}</h1>
        <p>
          {posts.length} {posts.length === 1 ? "post" : "posts"} tagged with
          &ldquo;{tag}&rdquo;
        </p>
      </div>

      <div className="post-grid">
        {posts.map((post) => (
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

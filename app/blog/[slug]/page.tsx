import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { getAllPosts, getPost, formatDate, tagSlug } from "@/lib/posts";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <article className="article">
      <Link href="/" className="back-link">
        ← Back to blog
      </Link>
      <header className="article-head">
        <span className="eyebrow">{post.category}</span>
        <h1>{post.title}</h1>
        <div className="post-meta">
          <span>{formatDate(post.date)}</span>
          <span>·</span>
          <span>{post.readingTime}</span>
        </div>
      </header>
      <div className="prose">
        <MDXRemote
          source={post.content}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm],
              rehypePlugins: [[rehypeHighlight, { ignoreMissing: true }]],
            },
          }}
        />
      </div>
      {post.tags.length > 0 && (
        <div className="tag-row">
          {post.tags.map((tag) => (
            <Link key={tag} href={`/tag/${tagSlug(tag)}`} className="tag">
              {tag}
            </Link>
          ))}
        </div>
      )}
    </article>
  );
}

import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://prateeksachan.com"),
  title: {
    default: "Prateek Sachan — Blog",
    template: "%s — Prateek Sachan",
  },
  description:
    "Writings on search systems, Elasticsearch, Solr, and open source by Prateek Sachan.",
  alternates: { types: { "application/rss+xml": "/feed.xml" } },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        <header className="site-header">
          <div className="container header-inner">
            <Link href="/" className="wordmark">
              prateek sachan
            </Link>
            <nav className="site-nav">
              <Link href="/">Blog</Link>
              <Link href="/archive">Archive</Link>
              <Link href="/about">About</Link>
              <a href="/feed.xml">RSS</a>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="site-footer">
          <div className="container footer-inner">
            <span>© {new Date().getFullYear()} Prateek Sachan</span>
            <span className="footer-links">
              <a
                href="https://github.com/prateeksachan"
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
              <a
                href="https://twitter.com/xan_ps"
                target="_blank"
                rel="noreferrer"
              >
                Twitter
              </a>
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}

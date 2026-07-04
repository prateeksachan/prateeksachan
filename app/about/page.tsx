export const metadata = { title: "About" };

export default function About() {
  return (
    <article className="article">
      <header className="article-head">
        <h1>About</h1>
      </header>
      <div className="prose">
        <p>
          This is my personal website where I post random writings. I love
          fiddling with code, traveling and{" "}
          <a href="http://instagram.com/xan_ps">photography</a>.
        </p>
        <p>
          I am interested in building fast and reliable search systems having
          extensive experience with Elasticsearch and Apache Solr.
        </p>
        <p>
          According to history, I graduated from Indian Institute of Technology
          Delhi, India after (somehow) managing to complete my Bachelors in
          Technology (Civil Engineering 2010–2014).
        </p>
        <p>
          I also contribute to Open Source, namely{" "}
          <a href="https://drupal.org">Drupal</a> and{" "}
          <a href="https://moodle.org">Moodle</a>.
        </p>
        <p>
          Feel free to contact me on Twitter{" "}
          <a href="https://twitter.com/xan_ps">@xan_ps</a>.
        </p>
      </div>
    </article>
  );
}

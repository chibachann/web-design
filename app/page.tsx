import Link from "next/link";
import { styleRecords } from "@/data/styles/registry";

/** Renders the foundation version of the design collection hub. */
export default function Home() {
  return (
    <main className="hub-shell">
      <header className="hub-header">
        <Link className="hub-brand" href="/" aria-label="Design Atlas home">
          DA
        </Link>
        <p>Independent design studies</p>
        <span>{styleRecords.length.toString().padStart(2, "0")} systems</span>
      </header>

      <section className="hub-hero" aria-labelledby="hub-title">
        <p className="eyebrow">A growing interface archive</p>
        <h1 id="hub-title">
          One idea.
          <br />
          Many visual languages.
        </h1>
        <p className="hub-intro">
          Complete, original websites shaped by carefully studied design
          systems. Each entry lives here and on its own subdomain.
        </p>
      </section>

      <section className="system-grid" aria-labelledby="systems-title">
        <div className="section-heading">
          <h2 id="systems-title">Systems in progress</h2>
          <p>Foundation release · collection 001</p>
        </div>

        <div className="system-list">
          {styleRecords.map((style, index) => (
            <article className="system-card" key={style.slug}>
              <div className={`system-swatch swatch-${style.slug}`}>
                <span>{String(index + 1).padStart(2, "0")}</span>
              </div>
              <div className="system-copy">
                <div>
                  <p className="system-category">{style.category}</p>
                  <h3>{style.displayName}</h3>
                </div>
                <p>{style.description}</p>
                <div className="system-actions">
                  <span data-status={style.status}>{style.status}</span>
                  {style.status === "building" ? (
                    <Link href={`/sites/${style.slug}`}>Open foundation →</Link>
                  ) : (
                    <span>Queued</span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="hero">
      <section className="shell">
        <div className="card stack">
          <p className="muted">Digital Marketer / Foundation</p>
          <h1>AI Digital Marketing SaaS</h1>
          <p className="muted">
            Multi-business, agency, and affiliate marketing workloads on one
            durable, tenant-aware platform.
          </p>
          <div>
            <Link className="button" href="/login">
              Open workspace
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

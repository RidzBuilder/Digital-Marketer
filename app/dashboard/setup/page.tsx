import Link from "next/link";

export default function SetupPage() {
  return (
    <main className="shell" style={{ padding: "48px 0" }}>
      <div className="card stack" style={{ maxWidth: 720, margin: "0 auto" }}>
        <p className="muted">P1 SaaS Core</p>
        <h1>Marketing workspace setup</h1>
        <p className="muted">Configure the tenant hierarchy in order: business, brand, then product.</p>
        <div className="grid">
          <Link className="button" href="/dashboard/businesses/new">1. Add business</Link>
          <Link className="button" href="/dashboard/brands/new">2. Add brand</Link>
          <Link className="button" href="/dashboard/products/new">3. Add product</Link>
        </div>
      </div>
    </main>
  );
}
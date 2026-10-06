import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createProductAction } from "../../core-actions";

export default async function NewProductPage() {
  const supabase = await createClient();
  const [{ data: workspaces }, { data: businesses }, { data: brands }] = await Promise.all([
    supabase.from("workspaces").select("id,name").order("created_at"),
    supabase.from("businesses").select("id,name,workspace_id").order("created_at"),
    supabase.from("brands").select("id,name,workspace_id,business_id").order("created_at"),
  ]);

  return (
    <main className="shell" style={{ padding: "48px 0" }}>
      <div className="card stack" style={{ maxWidth: 620, margin: "0 auto" }}>
        <Link className="muted" href="/dashboard/setup">Back to setup</Link>
        <h1>Add product</h1>
        <form className="stack" action={createProductAction}>
          <select className="input" name="workspace_id" defaultValue="" required>
            <option value="" disabled>Select workspace</option>
            {(workspaces ?? []).map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
          </select>
          <select className="input" name="business_id" defaultValue="" required>
            <option value="" disabled>Select business</option>
            {(businesses ?? []).map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
          <select className="input" name="brand_id" defaultValue="">
            <option value="">No brand / assign later</option>
            {(brands ?? []).map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
          <input className="input" name="name" placeholder="Product name" required />
          <input className="input" name="sku" placeholder="SKU" />
          <input className="input" name="product_url" placeholder="https://example.com/product" type="url" />
          <textarea className="input" name="description" placeholder="Product description" rows={4} />
          <button className="button" type="submit">Create product</button>
        </form>
      </div>
    </main>
  );
}

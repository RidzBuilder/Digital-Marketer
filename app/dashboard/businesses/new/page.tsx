import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createBusinessAction } from "../core-actions";

export default async function NewBusinessPage() {
  const supabase = await createClient();
  const { data: workspaces } = await supabase.from("workspaces").select("id,name").order("created_at");

  return (
    <main className="shell" style={{ padding: "48px 0" }}>
      <div className="card stack" style={{ maxWidth: 620, margin: "0 auto" }}>
        <Link className="muted" href="/dashboard/setup">Back to setup</Link>
        <h1>Add business</h1>
        <form className="stack" action={createBusinessAction}>
          <select className="input" name="workspace_id" defaultValue="" required>
            <option value="" disabled>Select workspace</option>
            {(workspaces ?? []).map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
          </select>
          <input className="input" name="name" placeholder="Business name" required />
          <input className="input" name="legal_name" placeholder="Legal name" />
          <input className="input" name="website_url" placeholder="https://example.com" type="url" />
          <input className="input" name="industry" placeholder="Industry" />
          <button className="button" type="submit">Create business</button>
        </form>
      </div>
    </main>
  );
}

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createWorkspaceAction } from "./actions";

type DashboardProps = { searchParams: Promise<{ error?: string }> };

export default async function DashboardPage({ searchParams }: DashboardProps) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) redirect("/login");

  const { data: workspaces } = await supabase
    .from("workspaces")
    .select("id,name,slug,mode,created_at")
    .order("created_at", { ascending: true });

  return (
    <main className="shell" style={{ padding: "48px 0" }}>
      <div className="stack">
        <div>
          <p className="muted">Authenticated user</p>
          <h1>{authData.user.email}</h1>
        </div>
        {params.error ? <p role="alert">{params.error}</p> : null}
        <section className="card stack">
          <div><p className="muted">P1 SaaS Core</p><h2>Workspaces</h2></div>
          <div className="grid">
            {(workspaces ?? []).map((workspace) => (
              <article className="card" key={workspace.id}>
                <strong>{workspace.name}</strong>
                <p className="muted">{workspace.mode} · {workspace.slug}</p>
              </article>
            ))}
            {!workspaces?.length ? <p className="muted">No workspace yet. Create the first tenant boundary below.</p> : null}
          </div>
          <form className="stack" action={createWorkspaceAction} style={{ maxWidth: 520 }}>
            <input className="input" name="name" placeholder="Workspace name" required />
            <select className="input" name="mode" defaultValue="multi_business">
              <option value="multi_business">Multi-business / Multi-brand</option>
              <option value="agency">Digital Marketing Agency</option>
              <option value="affiliate">Affiliate Marketing Ecosystem</option>
            </select>
            <button className="button" type="submit">Create workspace</button>
          </form>
        </section>
      </div>
    </main>
  );
}
import { signInAction, signUpAction } from "./actions";

type LoginPageProps = {
  searchParams: Promise<{ error?: string; message?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  return (
    <main className="hero">
      <section className="shell">
        <div className="card stack" style={{ maxWidth: 460, margin: "0 auto" }}>
          <div>
            <p className="muted">Digital Marketer</p>
            <h1>Sign in</h1>
            <p className="muted">Authentication is backed by Supabase Auth.</p>
          </div>

          {params.error ? <p role="alert">{params.error}</p> : null}
          {params.message ? <p className="muted">{params.message}</p> : null}

          <form className="stack" action={signInAction}>
            <input className="input" name="email" type="email" placeholder="Email" autoComplete="email" required />
            <input className="input" name="password" type="password" placeholder="Password" autoComplete="current-password" required />
            <button className="button" type="submit">Sign in</button>
          </form>

          <form className="stack" action={signUpAction}>
            <input className="input" name="email" type="email" placeholder="Email for new account" autoComplete="email" required />
            <input className="input" name="password" type="password" placeholder="Password (8+ characters)" autoComplete="new-password" minLength={8} required />
            <button className="button" type="submit">Create account</button>
          </form>
        </div>
      </section>
    </main>
  );
}

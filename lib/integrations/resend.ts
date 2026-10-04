import type { EmailMessage, EmailProvider, ProviderHealth } from "./contracts";

export class ResendProvider implements EmailProvider {
  async health(): Promise<ProviderHealth> {
    return {
      provider: "resend",
      configured: Boolean(process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL),
    };
  }

  async send(message: EmailMessage): Promise<{ id?: string }> {
    const apiKey = process.env.RESEND_API_KEY;
    const configuredFrom = process.env.RESEND_FROM_EMAIL;
    if (!apiKey || !configuredFrom) {
      throw new Error("Resend environment is not configured.");
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + apiKey,
      },
      body: JSON.stringify({
        from: configuredFrom || message.from,
        to: message.to,
        subject: message.subject,
        html: message.html,
      }),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error("Resend send failed with status " + response.status);
    }

    return { id: typeof data.id === "string" ? data.id : undefined };
  }
}

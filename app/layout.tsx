import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Digital Marketer",
  description: "AI Digital Marketing SaaS",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}

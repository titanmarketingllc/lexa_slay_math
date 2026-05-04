import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lexa Slay Math Quest",
  description: "A playful math study game built for quick confidence boosts and fun practice.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-[family-name:var(--font-body)]">
        {children}
        <Analytics />
      </body>
    </html>
  );
}

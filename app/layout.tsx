import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "./provider";
export const metadata: Metadata = {
    title: "RECLAIM — Your next safe step",
    description: "Clear, source-backed steps for hacked accounts, scams, lost devices, and other online problems.",
    manifest: "/manifest.webmanifest",
    robots: { index: false, follow: false },
    referrer: "no-referrer",
    icons: {
        icon: "/favicon.svg",
        shortcut: "/favicon.svg",
    },
};
export default function RootLayout({ children, }: Readonly<{
    children: React.ReactNode;
}>) {
    return (<html lang="en">
      <body className="antialiased"><AppProvider>{children}</AppProvider></body>
    </html>);
}

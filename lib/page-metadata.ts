import { getGuide } from "./catalog";

const pageTitles: Record<string, string> = {
  "/help": "Find your next safe step",
  "/guides": "Browse recovery guides",
  "/recovery": "My recovery",
  "/protect": "Stay protected",
  "/community": "Community",
  "/sources": "Our sources",
  "/privacy": "Privacy and safety",
  "/glossary": "Security glossary",
  "/account": "Account and preferences",
  "/editorial": "Editorial console",
};

export function pageTitle(path: string): string {
  if (path === "/") return "RECLAIM — Your next safe step";
  const title = path.startsWith("/guides/")
    ? getGuide(path.split("/")[2])?.title || "Guide unavailable"
    : path.startsWith("/community/")
      ? "Community discussion"
      : pageTitles[path] || "Page unavailable";
  return `${title} · RECLAIM`;
}

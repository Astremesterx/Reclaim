import type { Metadata } from "next";
import { pageTitle } from "@/lib/page-metadata";
import ReclaimApp from "../reclaim-app";

export async function generateMetadata({ params }: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return { title: pageTitle(`/${slug.join("/")}`) };
}

export default function Page() { return <ReclaimApp />; }

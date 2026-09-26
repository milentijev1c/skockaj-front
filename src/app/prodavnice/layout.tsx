import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Prodavnice",
  description:
    "Domaće prodavnice računarskih komponenti čije cene upoređujemo — Gigatron, Monitor, BigBang i ostali.",
  path: "/prodavnice",
});

export default function ProdavniceLayout({ children }: { children: React.ReactNode }) {
  return children;
}

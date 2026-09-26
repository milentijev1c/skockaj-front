import type { Metadata } from "next";
import { Suspense } from "react";
import { categoryBySlug, pageMetadata } from "@/lib/seo";
import ComponentsClient from "./components-client";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ kategorija?: string }>;
}): Promise<Metadata> {
  const { kategorija } = await searchParams;
  const cat = kategorija ? categoryBySlug(kategorija) : undefined;
  if (cat) {
    return pageMetadata({
      title: `${cat.title} — uporedi cene u Srbiji`,
      description: `Uporedi cene za kategoriju ${cat.title.toLowerCase()} iz domaćih prodavnica. Pronađi najjeftiniju opciju na skockaj.rs.`,
      path: `/komponente?kategorija=${cat.slug}`,
    });
  }
  return pageMetadata({
    title: "Komponente — uporedi cene",
    description:
      "Pregledaj procesore, grafičke kartice, RAM, matične ploče i ostale komponente. Uporedi cene iz domaćih prodavnica na jednom mestu.",
    path: "/komponente",
  });
}

/**
 * Static shell — no server fetch.
 * Embedding the full catalog in RSC payload made this page ~3MB / ~2s TTFB.
 * Parts load per category in the browser.
 */
export default function ComponentsPage() {
  return (
    <Suspense>
      <ComponentsClient initial={[]} />
    </Suspense>
  );
}

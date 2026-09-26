import type { Metadata } from "next";
import { apiFetch } from "@/lib/api";
import type { Build, Component } from "@/lib/types";
import BuildView from "./build-view";
import { notFound } from "next/navigation";
import { formatRsd, pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ hash: string }>;
}): Promise<Metadata> {
  const { hash } = await params;
  try {
    const build = await apiFetch<Build>(`/builds/${hash}`);
    const priceBit =
      build.total_price != null && build.total_price > 0
        ? ` — ${formatRsd(build.total_price)}`
        : "";
    return pageMetadata({
      title: `Konfiguracija${priceBit}`,
      description: `Pogledaj podeljenu PC konfiguraciju${priceBit} na skockaj.rs.`,
      path: `/k/${hash}`,
      // Share links are personal; don't flood the index
      noIndex: true,
    });
  } catch {
    return pageMetadata({
      title: "Konfiguracija nije pronađena",
      description: "Tražena konfiguracija ne postoji.",
      path: `/k/${hash}`,
      noIndex: true,
    });
  }
}

export default async function BuildPage({ params }: { params: Promise<{ hash: string }> }) {
  const { hash } = await params;

  let build: Build;
  try {
    build = await apiFetch<Build>(`/builds/${hash}`);
  } catch {
    notFound();
  }

  let allComponents: Component[] = [];
  try {
    allComponents = await apiFetch<Component[]>("/components/");
  } catch {
    allComponents = [];
  }
  const buildComponents = allComponents.filter((c) => build.components_json.includes(c.id));

  return <BuildView build={build} components={buildComponents} />;
}

import type { Metadata } from "next";
import { apiFetch } from "@/lib/api";
import type { Build, Component } from "@/lib/types";
import BuildView from "./build-view";
import { notFound } from "next/navigation";
import { formatRsd, pageMetadata } from "@/lib/seo";

// ISR: shared builds are stable; refresh hourly
export const revalidate = 3600;

// On-demand ISR — hashes are opaque and unbounded
export async function generateStaticParams() {
  return [];
}

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

  let buildComponents: Component[] = [];
  const ids = build.components_json ?? [];
  if (ids.length > 0) {
    try {
      buildComponents = await apiFetch<Component[]>(`/components/?ids=${ids.join(",")}`);
    } catch {
      buildComponents = [];
    }
  }

  return <BuildView build={build} components={buildComponents} />;
}

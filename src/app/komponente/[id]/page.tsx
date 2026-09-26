import type { Metadata } from "next";
import { apiFetch } from "@/lib/api";
import type { Component } from "@/lib/types";
import ComponentDetail from "./component-detail";
import { notFound } from "next/navigation";
import {
  breadcrumbJsonLd,
  categoryByValue,
  formatRsd,
  pageMetadata,
  priceRange,
  productJsonLd,
} from "@/lib/seo";
import { JsonLd } from "@/lib/json-ld";

export const dynamic = "force-dynamic";

async function loadComponent(id: string): Promise<Component | null> {
  try {
    return await apiFetch<Component>(`/components/${id}`);
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const component = await loadComponent(id);
  if (!component) {
    return pageMetadata({
      title: "Proizvod nije pronađen",
      description: "Tražena komponenta ne postoji ili je uklonjena iz kataloga.",
      path: `/komponente/${id}`,
      noIndex: true,
    });
  }

  const range = priceRange(component);
  const priceBit = range ? ` — od ${formatRsd(range.low)}` : "";
  const title = `${component.name}${priceBit}`;
  const description = `Uporedi cene za ${component.name} iz domaćih prodavnica${
    range ? ` — od ${formatRsd(range.low)}` : ""
  }. Specifikacije i ponude na skockaj.rs.`;

  return pageMetadata({
    title,
    description,
    path: `/komponente/${id}`,
  });
}

export default async function ComponentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const component = await loadComponent(id);
  if (!component) notFound();

  const cat = categoryByValue(component.category);
  const crumbs = [
    { name: "Početna", path: "/" },
    { name: "Komponente", path: "/komponente" },
    ...(cat ? [{ name: cat.title, path: `/komponente?kategorija=${cat.slug}` }] : []),
    { name: component.name, path: `/komponente/${component.id}` },
  ];

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd data={productJsonLd(component)} />
      <ComponentDetail component={component} />
    </>
  );
}

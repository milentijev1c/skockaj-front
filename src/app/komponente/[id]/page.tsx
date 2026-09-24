import { apiFetch } from "@/lib/api";
import type { Component } from "@/lib/types";
import ComponentDetail from "./component-detail";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ComponentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let component: Component;
  try {
    component = await apiFetch<Component>(`/components/${id}`);
  } catch {
    notFound();
  }

  return <ComponentDetail component={component} />;
}

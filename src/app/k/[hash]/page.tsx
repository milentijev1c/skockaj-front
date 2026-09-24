import { apiFetch } from "@/lib/api";
import type { Build, Component } from "@/lib/types";
import BuildView from "./build-view";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

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

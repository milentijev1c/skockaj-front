import { apiFetch } from "@/lib/api";
import type { Build, Component } from "@/lib/types";
import BuildView from "./build-view";
import { notFound } from "next/navigation";

export default async function BuildPage({ params }: { params: Promise<{ hash: string }> }) {
  const { hash } = await params;

  let build: Build;
  try {
    build = await apiFetch<Build>(`/builds/${hash}`);
  } catch {
    notFound();
  }

  const allComponents = await apiFetch<Component[]>("/components/");
  const buildComponents = allComponents.filter((c) => build.components_json.includes(c.id));

  return <BuildView build={build} components={buildComponents} />;
}

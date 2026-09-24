import { Suspense } from "react";
import { apiFetch } from "@/lib/api";
import type { Component } from "@/lib/types";
import ComponentsClient from "./components-client";

// Catalog is live data — never prerender against the API at build time
// (Vercel build used to ENOTFOUND api.skockaj.rs).
export const dynamic = "force-dynamic";

export default async function ComponentsPage() {
  let components: Component[] = [];
  try {
    components = await apiFetch<Component[]>("/components/");
  } catch {
    // API down / DNS not ready — client fetches again in the browser
    components = [];
  }
  return (
    <Suspense>
      <ComponentsClient initial={components} />
    </Suspense>
  );
}

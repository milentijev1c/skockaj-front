import { Suspense } from "react";
import { apiFetch } from "@/lib/api";
import type { Component } from "@/lib/types";
import ComponentsClient from "./components-client";

export default async function ComponentsPage() {
  const components = await apiFetch<Component[]>("/components/");
  return (
    <Suspense>
      <ComponentsClient initial={components} />
    </Suspense>
  );
}

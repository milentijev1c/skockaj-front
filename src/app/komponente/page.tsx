import { Suspense } from "react";
import ComponentsClient from "./components-client";

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

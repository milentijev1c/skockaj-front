import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Error demo",
  robots: { index: false, follow: false },
};

/** Dev/QA helper: forces a runtime error to exercise app/error.tsx recovery. */
export default function ErrorDemoPage() {
  throw new Error("error-demo: namerna greška za test error stranice");
}

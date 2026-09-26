import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Prijava",
  description: "Admin prijava za skockaj.rs",
  path: "/admin/login",
  noIndex: true,
});

export default function AdminLoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}

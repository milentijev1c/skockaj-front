import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Konfigurator računara",
  description:
    "Složi PC konfiguraciju uz proveru kompatibilnosti u realnom vremenu. Socket, RAM tip i napajanje — bez registracije.",
  path: "/konfigurator",
});

export default function KonfiguratorLayout({ children }: { children: React.ReactNode }) {
  return children;
}

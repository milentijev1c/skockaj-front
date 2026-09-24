import type { Metadata } from "next";
import AdminQueue from "./admin-queue";

export const metadata: Metadata = {
  title: "Admin — red usklađivanja",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminQueue />;
}

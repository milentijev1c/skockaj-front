import type { Metadata } from "next";
import AdminQueue from "./admin-queue";
import PendingComponents from "./pending-components";

export const metadata: Metadata = {
  title: "Admin — red usklađivanja",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <div>
      <AdminQueue />
      <PendingComponents />
    </div>
  );
}

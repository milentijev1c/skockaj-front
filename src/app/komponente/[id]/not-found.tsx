import { ErrorActions, ErrorShell } from "@/app/error-shell";

export default function ComponentNotFound() {
  return (
    <ErrorShell
      code="404"
      title="Proizvod nije pronađen"
      description="Ova komponenta ne postoji ili je uklonjena iz kataloga. Pogledaj ostale delove u istoj kategoriji."
    >
      <ErrorActions
        primaryHref="/komponente"
        primaryLabel="Nazad na komponente"
        secondaryHref="/"
        secondaryLabel="Početna"
      />
    </ErrorShell>
  );
}

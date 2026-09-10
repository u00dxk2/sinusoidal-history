import { Suspense } from "react";
import Poster from "@/components/Poster";
import { cycles } from "@/data/cycles";

export const metadata = {
  // Bare segment — the root layout's template appends "· Sinusoidal History".
  title: "Poster",
  description: "Shareable poster snapshot of where every cycle sits right now.",
  alternates: { canonical: "/poster" },
};

export default function PosterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-sm text-foreground/50">
          Loading poster…
        </div>
      }
    >
      <Poster cycles={cycles} />
    </Suspense>
  );
}

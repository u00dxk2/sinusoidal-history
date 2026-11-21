import { Suspense } from "react";
import Poster from "@/components/Poster";
import { cycles } from "@/data/cycles";
import { pageSocial } from "@/lib/pageMetadata";

const POSTER_DESCRIPTION =
  "Shareable poster of every cycle, each drawn as at most one period around its reference peak, cut at today.";

export const metadata = {
  // Bare segment — the root layout's template appends "· Sinusoidal History".
  title: "Poster",
  description: POSTER_DESCRIPTION,
  alternates: { canonical: "/poster" },
  ...pageSocial("/poster", "Poster", POSTER_DESCRIPTION),
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

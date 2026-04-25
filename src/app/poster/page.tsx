import { Suspense } from "react";
import Poster from "@/components/Poster";
import { cycles } from "@/data/cycles";

export const metadata = {
  title: "Poster · Sinusoidal History",
  description: "Shareable poster snapshot of where every cycle sits right now.",
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

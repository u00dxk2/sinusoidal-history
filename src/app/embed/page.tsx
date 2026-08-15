import { Suspense } from "react";
import EmbedView from "@/components/EmbedView";
import { cycles } from "@/data/cycles";
import { dataSeries } from "@/data/series";
import { annotations } from "@/data/annotations";

export const metadata = {
  title: "Sinusoidal History — embed",
  // Deliberate, not inherited: this is the overlay in iframe form, so the
  // indexable original really is "/". It read the same before today, but by
  // accident — every page did. Stated here so it survives the layout change.
  alternates: { canonical: "/" },
};

export default function EmbedPage() {
  return (
    <Suspense
      fallback={
        <div className="p-4 text-xs text-foreground/50">loading…</div>
      }
    >
      <EmbedView
        cycles={cycles}
        dataSeries={dataSeries}
        annotations={annotations}
      />
    </Suspense>
  );
}

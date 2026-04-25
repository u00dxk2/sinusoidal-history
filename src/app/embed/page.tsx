import { Suspense } from "react";
import EmbedView from "@/components/EmbedView";
import { cycles } from "@/data/cycles";
import { dataSeries } from "@/data/series";
import { annotations } from "@/data/annotations";

export const metadata = {
  title: "Sinusoidal History — embed",
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

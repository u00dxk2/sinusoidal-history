import { Suspense } from "react";
import { notFound } from "next/navigation";
import DesignPassMasthead from "@/components/DesignPassMasthead";
import Viz from "@/components/Viz";
import { annotations } from "@/data/annotations";
import { cycles } from "@/data/cycles";
import { dataSeries } from "@/data/series";
import { DESIGN_VARIANTS, designPassPreview, parseDesignVariant } from "@/lib/designPass";

// Preview of the three design-pass first screens (docs/DESIGN.md), for framing them from one
// local build. These routes exist ONLY in a build made with DESIGN_PASS_PREVIEW=1, which is
// never set on Render: without it no variant is prerendered and, with dynamicParams false,
// every /design-pass/* address is a 404. Never indexed either way.

type Params = { params: Promise<{ variant: string }> };

export const dynamicParams = false;

export const metadata = {
  title: "Design pass preview",
  robots: { index: false, follow: false },
};

export function generateStaticParams() {
  return designPassPreview() ? DESIGN_VARIANTS.map((variant) => ({ variant })) : [];
}

export default async function DesignPassPreview({ params }: Params) {
  const { variant: raw } = await params;
  const variant = parseDesignVariant(raw);
  if (!variant || !designPassPreview()) notFound();
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 pt-8 max-[390px]:pt-5 pb-12 sm:pt-12">
      <DesignPassMasthead variant={variant} />
      <Suspense fallback={<div className="h-[600px]" aria-busy="true" />}>
        <Viz cycles={cycles} dataSeries={dataSeries} annotations={annotations} />
      </Suspense>
    </div>
  );
}

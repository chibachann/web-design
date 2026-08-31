import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FoundationDemo } from "@/app/_sites/FoundationDemo";
import { getStyleRecord, styleRecords } from "@/data/styles/registry";

interface SitePageProps {
  params: Promise<{ slug: string }>;
}

/** Supplies static route candidates for every registered design study. */
export function generateStaticParams() {
  return styleRecords.map(({ slug }) => ({ slug }));
}

/** Builds route-specific metadata from the shared style registry. */
export async function generateMetadata({
  params,
}: SitePageProps): Promise<Metadata> {
  const { slug } = await params;
  const style = getStyleRecord(slug);

  return style
    ? { title: style.displayName, description: style.description }
    : { title: "Study not found" };
}

/** Renders a registered demo or returns a real 404 for unknown slugs. */
export default async function SitePage({ params }: SitePageProps) {
  const { slug } = await params;
  const style = getStyleRecord(slug);

  if (!style) {
    notFound();
  }

  return <FoundationDemo style={style} />;
}

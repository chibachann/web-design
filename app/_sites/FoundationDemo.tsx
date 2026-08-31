import Link from "next/link";
import type { StyleRecord } from "@/data/styles/registry";

interface FoundationDemoProps {
  style: StyleRecord;
}

/** Shows a routable foundation surface before the complete style demo lands. */
export function FoundationDemo({ style }: FoundationDemoProps) {
  return (
    <main className="foundation-demo">
      <div className="foundation-demo-inner">
        <p className="foundation-kicker">Foundation preview · {style.category}</p>
        <h1>{style.displayName}</h1>
        <p>{style.description}</p>
        <Link href="/">Back to Design Atlas</Link>
      </div>
    </main>
  );
}

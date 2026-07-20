import { Link } from "react-router-dom";
import SitePageLayout from "@/components/SitePageLayout";

// Dev-only index for the deepdive draft review loop.
const DRAFTS = [
  "codesandbox-alternatives",
  "firecracker-vs-cloud-hypervisor-vs-kata",
  "qemu-vs-kvm",
];

const DraftsIndex = () => (
  <SitePageLayout activeSection="blog" contentClassName="max-w-[760px] mx-auto px-6 pt-10 pb-[60px]">
    <h1 className="font-heading text-[clamp(32px,4.5vw,44px)] leading-[1.2] tracking-[-1px]">
      Deepdive drafts
    </h1>
    <p className="mt-3 font-mono-brand text-[13px] text-muted-foreground">
      Dev-only preview of ~/opencomputer-posts/posts/*.md — edits to the files hot-reload.
    </p>
    <ul className="mt-10 space-y-4">
      {DRAFTS.map((slug) => (
        <li key={slug}>
          <Link
            to={`/drafts/${slug}`}
            className="font-heading text-[22px] tracking-[-0.4px] underline decoration-foreground/30 hover:decoration-foreground transition-colors"
          >
            {slug}
          </Link>
        </li>
      ))}
    </ul>
  </SitePageLayout>
);

export default DraftsIndex;

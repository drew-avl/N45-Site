import { ArrowRight, Check } from "lucide-react";

type SecurityTriageCtaProps = {
  contactHref?: string;
};

const reviewAreas = [
  "Admin access, MFA & former users",
  "Forwarding, sharing & email authentication",
  "Backup & disaster recovery",
];

export default function SecurityTriageCta({
  contactHref = "/#contact",
}: SecurityTriageCtaProps) {
  return (
    <section
      aria-labelledby="security-triage-heading"
      className="bg-sunrise py-10 md:py-12"
    >
      <div className="mx-auto max-w-[88rem] px-5 md:px-8">
        <div className="rounded-[2rem] border border-white/12 bg-ink px-7 py-8 text-paper shadow-2xl md:px-10 md:py-10">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div>
              <div className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-mint">
                Fixed-price Microsoft 365 review
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-4">
                <h2
                  id="security-triage-heading"
                  className="font-display text-4xl leading-none tracking-tight md:text-5xl"
                >
                  N45 Microsoft Security Triage
                </h2>
                <span className="rounded-full bg-sunrise px-4 py-2 font-mono text-sm font-bold text-ink">
                  $495
                </span>
              </div>
              <p className="mt-5 max-w-4xl text-base leading-7 text-paper/72 md:text-lg">
                A read-only review for organizations with approximately 5–25
                users. You receive a plain-English scorecard and prioritized
                actions—without N45 changing your environment.
              </p>
              <ul className="mt-6 grid gap-3 text-sm font-semibold text-paper/80 md:grid-cols-3">
                {reviewAreas.map((area) => (
                  <li key={area} className="flex items-start gap-2.5">
                    <Check
                      aria-hidden="true"
                      className="mt-0.5 h-4 w-4 shrink-0 text-mint"
                    />
                    {area}
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:text-right">
              <a href={contactHref} className="button-primary group">
                Request the $495 review
                <ArrowRight
                  aria-hidden="true"
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                />
              </a>
              <p className="mt-3 text-xs font-semibold text-paper/55">
                Read-only. Clear priorities. No scare tactics.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

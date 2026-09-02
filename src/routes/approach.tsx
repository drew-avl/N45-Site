import { ArrowLeft, ArrowRight, Check, ChevronRight } from "lucide-react";

import { PageEyebrow, SiteFooter, SiteHeader } from "@/components/SiteChrome";

type ApproachPage = {
  number: string;
  slug: string;
  title: string;
  summary: string;
  promise: string;
  intro: string;
  focus: Array<{ title: string; body: string }>;
  method: Array<{ title: string; body: string }>;
  outcomes: string[];
};

const pages: ApproachPage[] = [
  {
    number: "01",
    slug: "listen-and-assess",
    title: "Listen & assess",
    summary:
      "We learn how your business works before recommending what should change.",
    promise:
      "A clear picture of what you have, what is getting in the way, and what deserves attention first.",
    intro:
      "Technology problems rarely live in isolation. A recurring login issue may mean nobody is sure who owns an account. A slow application may be caused by the office network, an outside vendor, or an aging computer. We start by understanding the work around the technology so the plan reflects the business—not a generic checklist.",
    focus: [
      {
        title: "People and daily work",
        body: "Who uses each system, where work slows down, how support happens now, and which interruptions cost the team the most time.",
      },
      {
        title: "Who can access what",
        body: "Microsoft 365 accounts, administrator access, shared sign-ins, onboarding, offboarding, and the places where ownership is unclear.",
      },
      {
        title: "The tools and providers you depend on",
        body: "Computers, office networks, essential business software, service providers, renewals, and the connections your operation depends on.",
      },
      {
        title: "Risks and repeat frustrations",
        body: "Known security gaps, fragile workarounds, repeat support issues, and systems, vendors, or people the business cannot operate without.",
      },
    ],
    method: [
      {
        title: "Start with a working conversation",
        body: "We speak with the people responsible for the business and, when useful, the employees closest to recurring problems.",
      },
      {
        title: "Create one useful record",
        body: "We organize systems, account access, vendors, owners, and open questions into a record that can guide real decisions.",
      },
      {
        title: "Prioritize by impact",
        body: "Findings are separated into urgent risks, day-to-day problems, and longer-term improvements so the next step stays proportionate.",
      },
    ],
    outcomes: [
      "A shared understanding of the current technology setup",
      "Clear ownership and fewer hidden surprises",
      "A prioritized plan instead of an oversized package",
      "A sensible starting point for dependable systems, better security, or ongoing support",
    ],
  },
  {
    number: "02",
    slug: "stabilize-the-essentials",
    title: "Stabilize the essentials",
    summary:
      "We handle urgent issues, stop repeat failures, and make the essentials dependable.",
    promise:
      "Fewer disruptions, clearer ownership, and a technology setup your team can rely on day to day.",
    intro:
      "Before adding tools or pursuing ambitious projects, the basics need to work consistently. This step focuses on problems that interrupt employees, create avoidable risk, or make every future change harder than it should be.",
    focus: [
      {
        title: "Problems that cannot wait",
        body: "Active outages, unreliable systems, sign-in problems, administrator accounts that are too exposed, and other issues stopping safe, productive work.",
      },
      {
        title: "Problems that keep coming back",
        body: "Patterns behind repeated support requests, unreliable computers, mismatched settings, and workarounds that have quietly become permanent.",
      },
      {
        title: "One dependable standard",
        body: "A clear minimum for security updates (patching), consistent computers, Microsoft 365, protection that blocks threats on work computers (endpoint protection), backups, and network reliability.",
      },
      {
        title: "Clear ownership and help",
        body: "Who handles each system, which vendor owns each problem, and how employees get help when something breaks.",
      },
    ],
    method: [
      {
        title: "Start with what stops work",
        body: "We address issues that stop work or create immediate risk before moving to lower-impact cleanup.",
      },
      {
        title: "Fix causes, not symptoms",
        body: "Repeated failures are traced to settings, aging equipment, account access, network, or vendor issues so the same problem is less likely to return.",
      },
      {
        title: "Set the standard and check the work",
        body: "Standards are applied deliberately, tested, and recorded so the technology becomes easier to support consistently.",
      },
    ],
    outcomes: [
      "Less time lost to repeat technology problems",
      "More consistent computers, accounts, and core services",
      "A known support path when something goes wrong",
      "A stable foundation for security and long-term improvement",
    ],
  },
  {
    number: "03",
    slug: "secure-and-document",
    title: "Secure & document",
    summary:
      "We strengthen practical safeguards and make critical technology knowledge usable.",
    promise:
      "Safer access, clearer recovery options, and documentation that belongs to your business.",
    intro:
      "Security and documentation work best together. A safeguard is harder to trust when no one knows who owns it, how it is set up, or what happens during recovery. We strengthen the systems that matter and record the information needed to operate them responsibly.",
    focus: [
      {
        title: "Safer sign-ins and administrator access",
        body: "Multifactor authentication (MFA) adds an extra sign-in check. The least-privilege approach limits employees and administrators to the access they need, while shared-account cleanup and consistent onboarding and offboarding keep ownership clear.",
      },
      {
        title: "Protected work computers",
        body: "Security updates (patching), encryption that protects stored data, protection that blocks threats on work computers (endpoint protection), consistent computer setup, and a clear list of devices that can reach business data.",
      },
      {
        title: "Backups that can support recovery",
        body: "What data is backed up, where copies live, who receives alerts, and whether the recovery steps have been tested rather than assumed.",
      },
      {
        title: "One clear business record",
        body: "Useful IT documentation that organizes equipment, vendors, accounts, owners, network details, renewals, and recovery steps for the people authorized to use it.",
      },
    ],
    method: [
      {
        title: "Reduce the risks that matter",
        body: "Recommendations reflect the data, systems, team, and obligations of the business rather than a fear-driven list of products.",
      },
      {
        title: "Check that protections work",
        body: "We confirm that security tools report correctly, account access works as intended, and recovery information is sufficient to take action.",
      },
      {
        title: "Create documentation people can maintain",
        body: "Records use clear ownership and a consistent structure so they stay useful after the initial project is complete.",
      },
    ],
    outcomes: [
      "Less risk from unclear or excessive access",
      "Better visibility into devices, protection, and recovery",
      "Faster, calmer response when an issue occurs",
      "Critical knowledge that does not live in one person’s head",
    ],
  },
  {
    number: "04",
    slug: "manage-and-improve",
    title: "Manage & improve",
    summary:
      "We support your technology, review what is changing, and improve it over time.",
    promise:
      "Technology that stays useful as your people, priorities, vendors, and risks change.",
    intro:
      "Even a stable setup needs attention. Employees join and leave, software changes, computers age, vendors shift, and yesterday’s workaround becomes tomorrow’s bottleneck. Ongoing management keeps the essentials dependable while creating room for deliberate improvement.",
    focus: [
      {
        title: "Responsive support",
        body: "A clear place for employees to get help, with recurring issues tracked beyond the individual ticket.",
      },
      {
        title: "Routine checks and upkeep",
        body: "Security updates (patching), checks on work computers, backups, alerts, account administration, and routine upkeep handled on a clear schedule.",
      },
      {
        title: "People, computers, and changes",
        body: "Onboarding, offboarding, computer replacement, vendor coordination, office changes, and projects managed with less disruption.",
      },
      {
        title: "Review and simplify repeated work",
        body: "Support patterns, risks, upcoming needs, and repeated tasks reviewed for practical improvements, automation, and cleaner workflows.",
      },
    ],
    method: [
      {
        title: "Set clear responsibilities",
        body: "Systems, service expectations, responsibilities, and the path for urgent help are made clear before ongoing work begins.",
      },
      {
        title: "Review patterns, not just tickets",
        body: "We look across support requests, alerts, new hires, departures, and business changes to identify what should be fixed or simplified next.",
      },
      {
        title: "Improve in proportion to the business",
        body: "Projects and automation are prioritized when they reduce friction, risk, or cost—not simply because a new tool exists.",
      },
    ],
    outcomes: [
      "A dependable place for employees to get support",
      "Routine maintenance completed consistently",
      "Better planning for changes, renewals, and computer replacement",
      "Steady improvement without unnecessary complexity",
    ],
  },
];

function getCurrentPage() {
  const slug = window.location.pathname.split("/").filter(Boolean).at(-1);
  return pages.find((page) => page.slug === slug) ?? pages[0];
}

export default function Approach() {
  const page = getCurrentPage();
  const index = pages.findIndex((candidate) => candidate.slug === page.slug);
  const previous = pages[index - 1];
  const next = pages[index + 1];

  return (
    <div className="min-h-screen overflow-x-clip bg-paper text-ink">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <SiteHeader />
      <main id="main-content">
        <section className="relative overflow-hidden bg-ink py-20 text-paper md:py-28">
          <div className="absolute inset-0 bg-[url('/assets/ridge-pattern.svg')] bg-cover bg-bottom opacity-30" />
          <div className="relative mx-auto max-w-[88rem] px-5 md:px-8">
            <nav aria-label="Breadcrumb" className="text-sm text-paper/65">
              <a className="hover:text-mint" href="/">
                Home
              </a>
              <span aria-hidden="true" className="px-2">
                /
              </span>
              <a className="hover:text-mint" href="/#approach">
                Approach
              </a>
              <span aria-hidden="true" className="px-2">
                /
              </span>
              <span aria-current="page">{page.title}</span>
            </nav>

            <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-end lg:gap-20">
              <div>
                <PageEyebrow theme="dark">Step {page.number} of 04</PageEyebrow>
                <h1 className="mt-7 max-w-5xl font-display text-[clamp(3.5rem,7vw,6rem)] leading-[0.94] tracking-[-0.035em] text-balance">
                  {page.title}
                </h1>
                <p className="mt-7 max-w-3xl text-xl leading-9 text-paper/78 md:text-2xl">
                  {page.summary}
                </p>
              </div>
              <p className="border-t border-mint/40 pt-6 text-base font-semibold leading-7 text-mint lg:border-t-0 lg:border-l lg:pl-8">
                {page.promise}
              </p>
            </div>
          </div>
        </section>

        <section className="py-20 md:py-28">
          <div className="mx-auto grid max-w-[88rem] gap-14 px-5 md:px-8 lg:grid-cols-[.7fr_1.3fr] lg:gap-24">
            <div>
              <h2 className="font-display text-4xl leading-tight tracking-tight md:text-5xl">
                What this step is for
              </h2>
            </div>
            <p className="max-w-3xl text-lg leading-8 text-ridge">
              {page.intro}
            </p>
          </div>
        </section>

        <section className="bg-mist py-20 md:py-28">
          <div className="mx-auto max-w-[88rem] px-5 md:px-8">
            <div className="max-w-3xl">
              <h2 className="font-display text-5xl leading-[0.98] tracking-tight text-balance md:text-6xl">
                What we look at
              </h2>
              <p className="mt-6 text-lg leading-8 text-ridge">
                What we review changes with the business, but these are the
                areas that shape the work.
              </p>
            </div>
            <div className="mt-14 grid gap-px overflow-hidden rounded-2xl bg-ink/10 sm:grid-cols-2">
              {page.focus.map((item) => (
                <article key={item.title} className="bg-paper p-7 md:p-10">
                  <h3 className="font-display text-3xl tracking-tight">
                    {item.title}
                  </h3>
                  <p className="mt-4 max-w-xl leading-7 text-ridge">
                    {item.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-spruce py-20 text-paper md:py-28">
          <div className="mx-auto grid max-w-[88rem] gap-14 px-5 md:px-8 lg:grid-cols-[.68fr_1.32fr] lg:gap-24">
            <div>
              <h2 className="font-display text-5xl leading-[0.98] tracking-tight md:text-6xl">
                How N45 does it
              </h2>
              <p className="mt-6 max-w-md leading-7 text-paper/68">
                Direct communication, practical priorities, and work that can be
                explained and maintained.
              </p>
            </div>
            <ol className="divide-y divide-white/12 border-y border-white/12">
              {page.method.map((item, methodIndex) => (
                <li
                  key={item.title}
                  className="grid gap-5 py-7 sm:grid-cols-[2.5rem_1fr] sm:gap-7"
                >
                  <span className="font-mono text-xs font-semibold text-mint">
                    {String(methodIndex + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-display text-3xl tracking-tight">
                      {item.title}
                    </h3>
                    <p className="mt-3 max-w-2xl leading-7 text-paper/70">
                      {item.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="py-20 md:py-28">
          <div className="mx-auto grid max-w-[88rem] gap-14 px-5 md:px-8 lg:grid-cols-[.72fr_1.28fr] lg:items-start lg:gap-24">
            <div>
              <h2 className="font-display text-5xl leading-[0.98] tracking-tight text-balance md:text-6xl">
                What it means for your business
              </h2>
            </div>
            <div>
              <ul className="divide-y divide-ink/12 border-y border-ink/12">
                {page.outcomes.map((outcome) => (
                  <li key={outcome} className="flex items-start gap-4 py-5">
                    <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-mint text-ink">
                      <Check
                        aria-hidden="true"
                        className="h-3.5 w-3.5 stroke-[3]"
                      />
                    </span>
                    <span className="text-lg font-semibold leading-7">
                      {outcome}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <a href="/book/" className="button-dark group">
                  Talk through your setup
                  <ArrowRight
                    aria-hidden="true"
                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  />
                </a>
                <a
                  href="/managed-it-services-asheville/"
                  className="inline-flex min-h-13 items-center justify-center gap-2 px-3 text-sm font-bold text-teal hover:text-ink"
                >
                  Explore ongoing IT support
                  <ChevronRight aria-hidden="true" className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </section>

        <nav
          aria-label="N45 approach steps"
          className="border-t border-ink/10 bg-mist"
        >
          <div className="mx-auto grid max-w-[88rem] md:grid-cols-2">
            <div className="border-b border-ink/10 md:border-r md:border-b-0">
              {previous ? (
                <a
                  href={`/approach/${previous.slug}/`}
                  className="group flex min-h-40 items-center gap-5 px-5 py-8 transition-colors hover:bg-paper md:px-8"
                >
                  <ArrowLeft
                    aria-hidden="true"
                    className="h-5 w-5 shrink-0 text-teal transition-transform group-hover:-translate-x-1"
                  />
                  <span>
                    <span className="block text-sm font-semibold text-ridge">
                      Previous step
                    </span>
                    <span className="mt-2 block font-display text-3xl tracking-tight">
                      {previous.title}
                    </span>
                  </span>
                </a>
              ) : (
                <a
                  href="/#approach"
                  className="group flex min-h-40 items-center gap-5 px-5 py-8 transition-colors hover:bg-paper md:px-8"
                >
                  <ArrowLeft
                    aria-hidden="true"
                    className="h-5 w-5 shrink-0 text-teal transition-transform group-hover:-translate-x-1"
                  />
                  <span>
                    <span className="block text-sm font-semibold text-ridge">
                      Back to
                    </span>
                    <span className="mt-2 block font-display text-3xl tracking-tight">
                      The full approach
                    </span>
                  </span>
                </a>
              )}
            </div>
            <div>
              {next ? (
                <a
                  href={`/approach/${next.slug}/`}
                  className="group flex min-h-40 items-center justify-end gap-5 px-5 py-8 text-right transition-colors hover:bg-paper md:px-8"
                >
                  <span>
                    <span className="block text-sm font-semibold text-ridge">
                      Next step
                    </span>
                    <span className="mt-2 block font-display text-3xl tracking-tight">
                      {next.title}
                    </span>
                  </span>
                  <ArrowRight
                    aria-hidden="true"
                    className="h-5 w-5 shrink-0 text-teal transition-transform group-hover:translate-x-1"
                  />
                </a>
              ) : (
                <a
                  href="/book/"
                  className="group flex min-h-40 items-center justify-end gap-5 px-5 py-8 text-right transition-colors hover:bg-paper md:px-8"
                >
                  <span>
                    <span className="block text-sm font-semibold text-ridge">
                      Ready to start?
                    </span>
                    <span className="mt-2 block font-display text-3xl tracking-tight">
                      Book a conversation
                    </span>
                  </span>
                  <ArrowRight
                    aria-hidden="true"
                    className="h-5 w-5 shrink-0 text-teal transition-transform group-hover:translate-x-1"
                  />
                </a>
              )}
            </div>
          </div>
        </nav>
      </main>
      <SiteFooter />
    </div>
  );
}

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import {
  ArrowRight,
  Building2,
  Check,
  ChevronRight,
  FileCheck2,
  Hammer,
  HeartPulse,
  KeyRound,
  Laptop,
  Mail,
  MapPin,
  Network,
  Phone,
  Scale,
  ShieldCheck,
  UtensilsCrossed,
  Workflow,
  type LucideIcon,
} from "lucide-react";

import heroImg from "@/assets/hero-mountains.jpg";
import { trackEvent } from "@/analytics";
import { MobileNavigation, RemoteSupportButton } from "@/components/SiteChrome";
import SecurityTriageCta from "@/components/SecurityTriageCta";

const CONTACT_ENDPOINT = import.meta.env.VITE_CONTACT_ENDPOINT as
  string | undefined;
const CONTACT_FROM_EMAIL = "noreply@n45tech.com";

type ContactResponse = {
  success?: boolean;
  message?: string;
};

type Service = {
  icon: LucideIcon;
  number: string;
  title: string;
  body: string;
  outcome: string;
  href?: string;
};

type ProcessStep = {
  number: string;
  title: string;
  body: string;
  href: string;
};

const services: Service[] = [
  {
    icon: Laptop,
    number: "01",
    title: "Everyday IT help",
    body: "Day-to-day help with computers, email, and software, plus updates and new-employee setup that keep your team working.",
    outcome: "Fewer repeat problems. Faster, calmer workdays.",
  },
  {
    icon: KeyRound,
    number: "02",
    title: "Safer access to business data",
    body: "Protect company accounts and files, control who can access sensitive information, and remove access people no longer need.",
    outcome: "The right access for the right people.",
  },
  {
    icon: ShieldCheck,
    number: "03",
    title: "Protection that fits the risk",
    body: "Protect work computers, review practical risks, and check backups. We prioritize the safeguards that matter to your business.",
    outcome: "Practical safeguards, clearly prioritized—no scare tactics.",
  },
  {
    icon: Network,
    number: "04",
    title: "Reliable internet and connections",
    body: "Keep office internet, Wi-Fi, and connections between your sites reliable, so your team can get on with work.",
    outcome: "A stable foundation from the front desk to the field.",
  },
  {
    icon: FileCheck2,
    number: "05",
    title: "A plan when something breaks",
    body: "Record backup and recovery steps, equipment, vendors, accounts, and ownership so your business knows how to get working again.",
    outcome: "Critical knowledge that never lives in one person’s head.",
  },
  {
    icon: Workflow,
    number: "06",
    title: "AI & Automation",
    body: "Choose useful AI tools, simplify repeated tasks, and build AI assistants with clear oversight and ongoing support.",
    outcome: "Less busywork. More consistency.",
    href: "/ai-automation/",
  },
];

const industries = [
  {
    icon: HeartPulse,
    label: "Healthcare",
    title: "Clinics, dental & specialty practices",
    body: "Safer accounts and computers, protected access to patient records, and clear records of who can reach sensitive information.",
    points: [
      "Safer account and device access",
      "Clear records of vendors and access to patient information",
    ],
  },
  {
    icon: Scale,
    label: "Professional firms",
    title: "Legal, accounting & advisory teams",
    body: "Confidential file access, dependable backups, and steady support through tax season, closings, and trial preparation.",
    points: [
      "Stronger sign-in protection and appropriate access",
      "Secure ways to work with clients",
    ],
  },
  {
    icon: UtensilsCrossed,
    label: "Hospitality",
    title: "Hotels, restaurants, taprooms & venues",
    body: "Separate Wi-Fi for guests and business operations, reliable checkout systems, and clear documentation built for your busiest nights.",
    points: [
      "Guest and business traffic kept separate",
      "Reliable checkout and kiosk systems",
    ],
  },
  {
    icon: Hammer,
    label: "Industry & trades",
    title: "Manufacturers, contractors & field crews",
    body: "Reliable technology for office, shop, and remote teams—with consistent, work-ready computers and accountable support.",
    points: [
      "Connections between offices and job sites",
      "Consistent computers ready for the job",
    ],
  },
];

const process: ProcessStep[] = [
  {
    number: "01",
    title: "Listen & assess",
    body: "We learn how the business works, then list the accounts, equipment, vendors, owners, risks, and repeat problems that shape the plan.",
    href: "/approach/listen-and-assess/",
  },
  {
    number: "02",
    title: "Stabilize the essentials",
    body: "Urgent issues get handled first. We reduce repeat problems and set a dependable minimum standard for computers, accounts, and support.",
    href: "/approach/stabilize-the-essentials/",
  },
  {
    number: "03",
    title: "Secure & document",
    body: "Account access, computers, security tools, backups, and recovery details become safer, clearer, and easier to manage.",
    href: "/approach/secure-and-document/",
  },
  {
    number: "04",
    title: "Manage & improve",
    body: "Ongoing checks, support, reviews, and automation keep your technology useful as the business changes.",
    href: "/approach/manage-and-improve/",
  },
];

const faqs = [
  {
    question: "What happens on the first call?",
    answer:
      "We spend 20 minutes on your current IT setup, the problems interrupting your team, and what you want to improve. You do not need to prepare a technical inventory. If N45 can help, we will explain the next step.",
  },
  {
    question: "Is the security review $495, or is the call $495?",
    answer:
      "The Microsoft 365 security review is $495. The 15-minute fit call comes first, to confirm the review is right for your organization. Booking that call does not purchase the review. The review is prepaid and has no long-term contract.",
  },
  {
    question: "What do we receive from the security review?",
    answer:
      "A plain-English scorecard and your five highest-priority next steps for protecting your Microsoft 365 accounts, files, and business data. We review sign-in protection, current and former users' access, outside sharing, email forwarding and sender verification, and backup coverage. The review is read-only: N45 does not change your settings.",
  },
  {
    question: "Do you replace our current IT provider?",
    answer:
      "N45 can become your managed IT partner or guide a planned transition with clear responsibilities. The first step is understanding what is working, what is not, and what your team actually needs.",
  },
  {
    question: "Can you help with one specific project?",
    answer:
      "Yes. Account cleanup, safer file sharing, security reviews, network improvements, documentation, and AI or automation can all begin as focused projects when that is the right fit.",
  },
  {
    question: "Is N45 only for Asheville businesses?",
    answer:
      "N45 serves businesses in Asheville and across Western North Carolina. If your organization is outside the area, we will consider your service needs and practical logistics on a case-by-case basis.",
  },
];

export default function Index() {
  useEffect(() => {
    const targetId = window.location.hash.slice(1);

    if (!targetId) return;

    const frame = window.requestAnimationFrame(() => {
      const target = document.getElementById(targetId);

      if (!target) return;

      const root = document.documentElement;
      const originalScrollBehavior = root.style.scrollBehavior;
      root.style.scrollBehavior = "auto";
      target.scrollIntoView();
      root.style.scrollBehavior = originalScrollBehavior;
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="home-page min-h-screen overflow-x-clip bg-paper text-ink">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <Nav />
      <main id="main-content" className="[&_section[id]]:scroll-mt-36">
        <Hero />
        <SecurityTriageCta
          contactHref="/book/?service=security-review"
          conversionDetails
        />
        <Outcomes />
        <Services />
        <Industries />
        <Process />
        <LocalPromise />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-paper/95 backdrop-blur-xl">
      <div className="bg-ink text-paper">
        <div className="mx-auto flex h-9 max-w-[88rem] items-center justify-center px-4 sm:justify-end sm:px-5 md:px-8">
          <a
            href="tel:+18285151530"
            aria-label="Call N45 Technology Solutions at (828) 515-1530"
            className="font-mono text-xs font-semibold tracking-[0.06em] text-paper transition hover:text-mint focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-mint"
          >
            Call N45: (828) 515-1530
          </a>
        </div>
      </div>
      <div className="mx-auto flex h-20 max-w-[88rem] items-center justify-between gap-3 px-4 sm:gap-6 sm:px-5 md:px-8">
        <HeaderLogo />

        <nav
          aria-label="Primary navigation"
          className="hidden items-center gap-8 text-sm font-semibold text-ridge lg:flex"
        >
          <a className="nav-link" href="#services">
            Services
          </a>
          <a className="nav-link" href="#industries">
            Industries
          </a>
          <a className="nav-link" href="#approach">
            Approach
          </a>
          <a className="nav-link" href="#about">
            Why N45
          </a>
          <a className="nav-link" href="/blog/">
            Field Notes
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="/book/?service=it-call"
            data-analytics-location="header"
            className="group inline-flex min-h-11 items-center gap-1.5 rounded-full bg-ink px-3 py-2.5 text-sm font-bold text-paper transition hover:bg-spruce sm:gap-2 sm:px-5"
          >
            <span className="hidden sm:inline">Schedule a call</span>
            <span className="sm:hidden">Book</span>
            <ArrowRight
              aria-hidden="true"
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
            />
          </a>
          <MobileNavigation
            links={[
              { href: "#services", label: "Services" },
              { href: "#industries", label: "Industries" },
              { href: "#approach", label: "Approach" },
              { href: "#about", label: "Why N45" },
              { href: "/blog/", label: "Field Notes" },
              { href: "/refer/", label: "Refer a business" },
            ]}
          />
        </div>
      </div>
    </header>
  );
}

function HeaderLogo() {
  return (
    <a
      href="#top"
      aria-label="N45 Technology Solutions home"
      className="block shrink-0"
    >
      <img
        src="/assets/n45-lockup-dark.svg"
        alt=""
        aria-hidden="true"
        className="header-logo h-12 w-auto sm:h-14 lg:h-16"
      />
    </a>
  );
}

function Hero() {
  return (
    <section id="top" className="relative isolate bg-ink text-paper">
      <div className="absolute inset-0 -z-20">
        <img
          src={heroImg}
          alt="Layered Blue Ridge Mountains at sunrise"
          width={1920}
          height={1080}
          fetchPriority="high"
          className="h-full w-full object-cover object-[58%_center]"
        />
      </div>
      <div className="hero-overlay absolute inset-0 -z-10" />
      <div className="absolute inset-0 -z-10 bg-[url('/assets/ridge-pattern.svg')] bg-bottom bg-no-repeat opacity-30 mix-blend-screen" />

      <div className="mx-auto grid max-w-[88rem] items-center gap-10 px-5 py-12 md:px-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(22rem,.6fr)] lg:gap-12 lg:py-16">
        <div className="max-w-4xl">
          <Eyebrow theme="dark">Asheville-based · Western NC focused</Eyebrow>
          <h1 className="mt-6 max-w-4xl font-display text-[clamp(3rem,5.4vw,5.5rem)] leading-[0.98] tracking-[-0.04em] text-balance">
            Reliable IT support for businesses across{" "}
            <em className="font-display font-normal text-mint">
              Western North Carolina.
            </em>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-paper/78 md:text-xl">
            Keep your team working and protect what your business depends on.
            N45 brings local support, safer accounts and systems, and clear
            answers when you need them.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
            <a
              href="/book/?service=it-call"
              className="button-primary group"
              data-analytics-location="hero"
            >
              Schedule a 20-minute call
              <ArrowRight
                aria-hidden="true"
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
              />
            </a>
            <a
              href="/book/?service=security-review"
              className="button-ghost-light group"
              data-analytics-location="hero_security"
            >
              <ShieldCheck aria-hidden="true" className="h-4 w-4" />
              Start the $495 security review
            </a>
          </div>

          <p className="mt-4 text-sm leading-6 text-paper/75">
            The security review starts with a 15-minute fit call. Booking the
            call does not purchase the review.
          </p>

          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-paper/70">
            {[
              "Local, accountable support",
              "Security without fear-selling",
              "Systems documented clearly",
            ].map((item) => (
              <span key={item} className="flex items-center gap-2">
                <Check aria-hidden="true" className="h-4 w-4 text-mint" />
                {item}
              </span>
            ))}
          </div>
        </div>

        <aside className="hero-card self-end rounded-[2rem] border border-white/18 bg-ink/70 p-7 backdrop-blur-md md:p-8 lg:self-center">
          <div className="font-mono text-[0.67rem] font-semibold uppercase tracking-[0.24em] text-sunrise">
            The N45 standard
          </div>
          <h2 className="mt-4 font-display text-4xl leading-none">
            Reliable.
            <br />
            Protected.
            <br />
            Documented.
          </h2>
          <div className="mt-7 divide-y divide-white/12 border-y border-white/12">
            {[
              ["01", "Protect the essentials"],
              ["02", "Write down what matters"],
              ["03", "Own the follow-through"],
            ].map(([number, label]) => (
              <div key={number} className="flex items-center gap-4 py-4">
                <span className="font-mono text-xs text-mint">{number}</span>
                <span className="text-sm font-bold text-paper/90">{label}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 flex items-start gap-3 text-sm leading-6 text-paper/65">
            <MapPin
              aria-hidden="true"
              className="mt-0.5 h-4 w-4 shrink-0 text-sunrise"
            />
            <span>Local to Asheville. Serving Western North Carolina.</span>
          </div>
        </aside>
      </div>
    </section>
  );
}

function Outcomes() {
  const outcomes = [
    {
      number: "01",
      title: "Less firefighting",
      body: "Recurring issues become fixes, standards, and a better day-to-day experience.",
    },
    {
      number: "02",
      title: "Less uncertainty",
      body: "Accounts, devices, vendors, and recovery details have a clear owner and record.",
    },
    {
      number: "03",
      title: "A clearer next step",
      body: "Security and technology decisions are prioritized by business risk—not a sales quota.",
    },
  ];

  return (
    <section className="relative bg-paper py-16 md:py-20">
      <div className="mx-auto max-w-[88rem] px-5 md:px-8">
        <div className="grid gap-8 lg:grid-cols-[.9fr_1.1fr] lg:items-center lg:gap-12">
          <div>
            <Eyebrow>The work behind the work</Eyebrow>
            <h2 className="mt-6 max-w-3xl font-display text-4xl leading-[1.02] tracking-tight text-balance sm:text-5xl md:text-6xl">
              Your business should not depend on the one person who remembers
              how everything works.
            </h2>
          </div>
          <div className="max-w-2xl lg:justify-self-end">
            <p className="text-lg leading-8 text-ridge">
              When technology is reactive, everyone feels it. N45 turns the
              hidden systems behind your business into a stable, protected, and
              understandable operation—so your team can focus on the work
              customers actually hired you to do.
            </p>
            <a
              href="#approach"
              className="text-link mt-7 inline-flex items-center gap-2"
            >
              See how N45 works
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="mt-10 grid overflow-hidden rounded-[2rem] border border-ink/10 bg-ink/10 md:grid-cols-3 md:gap-px">
          {outcomes.map((outcome) => (
            <article key={outcome.number} className="bg-mist p-6 md:p-8">
              <div className="font-mono text-xs font-semibold text-teal">
                {outcome.number}
              </div>
              <h3 className="mt-5 font-display text-3xl tracking-tight">
                {outcome.title}
              </h3>
              <p className="mt-3 leading-7 text-ridge">{outcome.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section id="services" className="bg-ink py-16 text-paper md:py-20">
      <div className="mx-auto max-w-[88rem] px-5 md:px-8">
        <div className="grid gap-8 xl:grid-cols-[.68fr_1.32fr] xl:gap-12">
          <div className="xl:sticky xl:top-32 xl:self-start">
            <Eyebrow theme="dark">What we manage</Eyebrow>
            <h2 className="mt-6 font-display text-5xl leading-[0.98] tracking-tight text-balance md:text-6xl">
              One clear view of the technology behind your business.
            </h2>
            <p className="mt-6 max-w-md text-lg leading-8 text-paper/68">
              Good IT should feel almost invisible: fewer interruptions, safer
              decisions, and clear answers when something changes.
            </p>
            <div className="mt-7 space-y-3 text-sm font-bold text-mint">
              <a
                className="text-link block text-mint"
                href="/managed-it-services-asheville/"
              >
                Get ongoing IT support in Asheville →
              </a>
              <a
                className="text-link block text-mint"
                href="/business-it-support-western-nc/"
              >
                Business IT support across Western NC →
              </a>
              <a
                className="text-link block text-mint"
                href="/cybersecurity-services-asheville/"
              >
                Protect your Asheville business →
              </a>
              <a className="text-link block text-mint" href="/ai-automation/">
                Explore AI &amp; Automation →
              </a>
            </div>
            <a
              href="/book/?service=it-call"
              className="button-outline-mint mt-9"
            >
              Talk through your setup
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </a>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <article key={service.number} className="service-card group">
                  <div className="flex items-start justify-between gap-6">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-mint/12 text-mint ring-1 ring-mint/20">
                      <Icon aria-hidden="true" className="h-5 w-5" />
                    </span>
                    <span className="font-mono text-xs text-paper/40">
                      {service.number}
                    </span>
                  </div>
                  <h3 className="mt-6 font-display text-3xl tracking-tight">
                    {service.href ? (
                      <a
                        href={service.href}
                        className="inline-flex items-center gap-3 hover:text-mint"
                      >
                        {service.title}
                        <ArrowRight
                          aria-hidden="true"
                          className="h-5 w-5 shrink-0"
                        />
                      </a>
                    ) : (
                      service.title
                    )}
                  </h3>
                  <p className="mt-4 pb-6 leading-7 text-paper/62">
                    {service.body}
                  </p>
                  <p className="mt-auto border-t border-white/10 pt-4 text-sm font-bold leading-6 text-mint">
                    {service.outcome}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function Industries() {
  return (
    <section id="industries" className="bg-paper py-16 md:py-20">
      <div className="mx-auto max-w-[88rem] px-5 md:px-8">
        <div className="max-w-4xl">
          <Eyebrow>Built for Western North Carolina</Eyebrow>
          <h2 className="mt-6 font-display text-5xl leading-[0.98] tracking-tight text-balance md:text-7xl">
            Technology shaped around how local business actually runs.
          </h2>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-ridge">
            N45 stays close to the operations we understand—places where trust,
            reliable access, confidentiality, and a real human response matter.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {industries.map((industry) => {
            const Icon = industry.icon;
            return (
              <article key={industry.label} className="industry-card">
                <div className="flex items-center gap-3 text-teal">
                  <Icon aria-hidden="true" className="h-5 w-5" />
                  <span className="font-mono text-[0.7rem] font-semibold uppercase tracking-[0.18em]">
                    {industry.label}
                  </span>
                </div>
                <h3 className="mt-6 max-w-lg font-display text-3xl leading-tight tracking-tight md:text-4xl">
                  {industry.title}
                </h3>
                <p className="mt-4 max-w-xl pb-6 leading-7 text-ridge">
                  {industry.body}
                </p>
                <ul className="mt-auto grid gap-3 border-t border-ink/10 pt-5 sm:grid-cols-2">
                  {industry.points.map((point) => (
                    <li
                      key={point}
                      className="flex items-start gap-2 text-sm font-bold text-ink/78"
                    >
                      <Check
                        aria-hidden="true"
                        className="mt-0.5 h-4 w-4 shrink-0 text-teal"
                      />
                      {point}
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Process() {
  return (
    <section
      id="approach"
      className="relative overflow-hidden bg-mist py-16 md:py-20"
    >
      <div className="absolute inset-x-0 bottom-0 h-64 bg-[url('/assets/ridge-pattern.svg')] bg-cover bg-bottom opacity-50" />
      <div className="relative mx-auto max-w-[88rem] px-5 md:px-8">
        <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:gap-12">
          <div>
            <Eyebrow>A practical path forward</Eyebrow>
            <h2 className="mt-6 font-display text-5xl leading-[0.98] tracking-tight text-balance md:text-7xl">
              From reactive to ready, one clear step at a time.
            </h2>
            <p className="mt-7 max-w-lg text-lg leading-8 text-ridge">
              N45 makes the essentials dependable before adding more tools. The
              result is easier to manage, easier to support, and better prepared
              for problems over time.
            </p>
          </div>

          <ol className="process-list overflow-hidden rounded-[2rem] border border-ink/10 bg-paper shadow-[0_24px_80px_rgba(10,36,35,0.08)]">
            {process.map((item) => (
              <li key={item.number}>
                <a href={item.href} className="process-row group">
                  <span className="font-mono text-xs font-semibold text-teal">
                    {item.number}
                  </span>
                  <div>
                    <h3 className="font-display text-3xl tracking-tight md:text-4xl">
                      {item.title}
                    </h3>
                    <p className="mt-3 max-w-2xl leading-7 text-ridge">
                      {item.body}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-teal sm:hidden">
                      See how this works
                      <ChevronRight aria-hidden="true" className="h-4 w-4" />
                    </span>
                  </div>
                  <ChevronRight
                    aria-hidden="true"
                    className="mt-2 hidden h-5 w-5 text-teal/50 transition-transform group-hover:translate-x-1 group-hover:text-teal sm:block"
                  />
                </a>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function LocalPromise() {
  const promises = [
    "You get a direct answer, not a maze of handoffs.",
    "Recommendations fit your real risk, team, and budget.",
    "Documentation belongs to the operation—not one technician.",
    "Recurring problems are tracked back to their cause.",
  ];

  return (
    <section
      id="about"
      className="relative overflow-hidden bg-spruce py-16 text-paper md:py-20"
    >
      <div className="absolute inset-0 bg-[url('/assets/ridge-pattern.svg')] bg-cover bg-center opacity-35" />
      <div className="relative mx-auto grid max-w-[88rem] gap-8 px-5 md:px-8 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:gap-12">
        <div>
          <Eyebrow theme="dark">Why N45</Eyebrow>
          <h2 className="mt-6 max-w-3xl font-display text-5xl leading-[0.98] tracking-tight text-balance md:text-7xl">
            Rooted here. Built to show up.
          </h2>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-paper/70">
            N45 is an Asheville-area technology company built around craft,
            independence, and relationships that hold up over time. We bring
            that same mentality to IT: do the work carefully, explain it
            plainly, and stay accountable after the urgent moment has passed.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="/book/?service=it-call"
              className="button-primary group"
              data-analytics-location="local"
            >
              Meet your local IT partner
              <ArrowRight
                aria-hidden="true"
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
              />
            </a>
            <a href="tel:+18285151530" className="button-ghost-light">
              <Phone aria-hidden="true" className="h-4 w-4" />
              (828) 515-1530
            </a>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/12 bg-ink/45 p-7 backdrop-blur-sm md:p-10">
          <div className="flex items-center gap-3 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-sunrise">
            <Building2 aria-hidden="true" className="h-4 w-4" />
            What good IT should feel like
          </div>
          <ul className="mt-8 divide-y divide-white/10 border-y border-white/10">
            {promises.map((promise) => (
              <li key={promise} className="flex items-start gap-4 py-5">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-mint text-ink">
                  <Check
                    aria-hidden="true"
                    className="h-3.5 w-3.5 stroke-[3]"
                  />
                </span>
                <span className="leading-7 text-paper/82">{promise}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  return (
    <section className="bg-paper py-16 md:py-20">
      <div className="mx-auto grid max-w-[88rem] gap-8 px-5 md:px-8 lg:grid-cols-[.72fr_1.28fr] lg:gap-12">
        <div>
          <Eyebrow>Common questions</Eyebrow>
          <h2 className="mt-6 font-display text-5xl leading-[0.98] tracking-tight md:text-6xl">
            A few things worth knowing.
          </h2>
          <p className="mt-6 max-w-md leading-7 text-ridge">
            No hard sell and no oversized first step. The goal is to understand
            the situation and recommend a practical way forward.
          </p>
        </div>

        <div className="divide-y divide-ink/12 border-y border-ink/12">
          {faqs.map((faq) => (
            <details key={faq.question} className="faq group">
              <summary>
                <span>{faq.question}</span>
                <span className="faq-icon" aria-hidden="true">
                  +
                </span>
              </summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const initialTopic =
    new URLSearchParams(window.location.search).get("topic") === "ai-automation"
      ? "Automation / documentation cleanup"
      : "";
  const [submitState, setSubmitState] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [statusMessage, setStatusMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;

    if (!form.reportValidity()) return;

    const formData = new FormData(form);
    const honeypot = String(formData.get("website") ?? "").trim();

    if (honeypot) {
      setSubmitState("success");
      setStatusMessage("Thanks. N45 will follow up shortly.");
      return;
    }

    const businessName = String(formData.get("businessName") ?? "").trim();
    const contactName = String(formData.get("contactName") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const topic = String(formData.get("topic") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();

    if (!CONTACT_ENDPOINT) {
      setSubmitState("error");
      setStatusMessage(
        "Online messages are temporarily unavailable. Call N45 at (828) 515-1530.",
      );
      return;
    }

    setSubmitState("sending");
    setStatusMessage("");

    try {
      const response = await fetch(CONTACT_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          businessName,
          contactName,
          email,
          topic,
          message,
          to: "hello@n45tech.com",
          from: CONTACT_FROM_EMAIL,
          replyTo: email,
          subject:
            "IT review request from " +
            (businessName || contactName || "N45 website"),
          source: "n45-site",
          submittedAt: new Date().toISOString(),
        }),
      });

      const result = (await response
        .json()
        .catch(() => ({}))) as ContactResponse;

      if (!response.ok || result.success === false) {
        throw new Error(result.message || "The message could not be sent.");
      }

      form.reset();
      trackEvent("generate_lead", {
        form_name: "contact_form",
        lead_type: "website_inquiry",
        lead_topic: topic,
      });
      setSubmitState("success");
      setStatusMessage(
        result.message ||
          "Your message has been sent. N45 will follow up shortly.",
      );
    } catch (error) {
      setSubmitState("error");
      setStatusMessage(
        error instanceof Error
          ? error.message
          : "The message could not be sent. Call N45 at (828) 515-1530.",
      );
    }
  }

  return (
    <section id="contact" className="bg-sunrise py-16 md:py-20">
      <div className="mx-auto grid max-w-[88rem] gap-8 px-5 md:px-8 lg:grid-cols-[.82fr_1.18fr] lg:items-start lg:gap-12">
        <div>
          <Eyebrow theme="warm">Start a conversation</Eyebrow>
          <h2 className="mt-6 font-display text-5xl leading-[0.98] tracking-tight text-balance md:text-7xl">
            Tell us what feels messy, risky, or unclear.
          </h2>
          <p className="mt-7 max-w-lg text-lg leading-8 text-ink/80">
            Tell us what you need help with. Your message goes directly to N45,
            and we will help you find a practical next step.
          </p>

          <a
            href="/book/?service=it-call"
            className="button-dark mt-7"
            data-analytics-location="closing_call"
          >
            Schedule a 20-minute call
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </a>

          <dl className="mt-10 space-y-5 text-sm">
            <ContactDetail icon={Phone} label="Call" href="tel:+18285151530">
              (828) 515-1530
            </ContactDetail>
            <ContactDetail
              icon={Mail}
              label="Email"
              href="mailto:hello@n45tech.com"
            >
              hello@n45tech.com
            </ContactDetail>
            <ContactDetail icon={MapPin} label="Local to">
              Asheville, North Carolina
            </ContactDetail>
          </dl>
        </div>

        <form
          id="contact-form"
          onSubmit={handleSubmit}
          noValidate
          className="relative rounded-[2rem] bg-paper p-6 shadow-[0_30px_90px_rgba(10,36,35,0.18)] md:p-10"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Business name"
              name="businessName"
              autoComplete="organization"
              maxLength={150}
            />
            <Field
              label="Your name"
              name="contactName"
              autoComplete="name"
              maxLength={120}
            />
            <Field
              label="Work email"
              name="email"
              type="email"
              autoComplete="email"
              maxLength={254}
            />

            <div>
              <label htmlFor="contact-topic" className="field-label">
                What can we help with?
              </label>
              <select
                id="contact-topic"
                name="topic"
                required
                defaultValue={initialTopic}
                className="field-control"
              >
                <option value="" disabled>
                  Select one
                </option>
                <option value="N45 Microsoft Security Triage ($495)">
                  Review our Microsoft 365 security ($495)
                </option>
                <option value="IT review / current provider concerns">
                  Review our IT or current provider
                </option>
                <option value="Microsoft 365 / account security">
                  Protect our accounts and business data
                </option>
                <option value="Managed IT support">
                  Get ongoing IT support
                </option>
                <option value="Cybersecurity / endpoint protection">
                  Protect our computers and business
                </option>
                <option value="Network or infrastructure issue">
                  Fix internet, Wi-Fi, or our office network
                </option>
                <option value="Automation / documentation cleanup">
                  AI, automation, or documentation help
                </option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="contact-message" className="field-label">
                What is going on?
              </label>
              <textarea
                id="contact-message"
                name="message"
                rows={5}
                required
                maxLength={5000}
                placeholder="A few details about your team, systems, or current challenge…"
                className="field-control resize-y"
              />
            </div>

            <div aria-hidden="true" className="honeypot">
              <label htmlFor="contact-website">Website</label>
              <input
                id="contact-website"
                name="website"
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={submitState === "sending"}
                className="button-dark group w-full justify-center sm:w-auto"
              >
                {submitState === "sending" ? "Sending…" : "Send my request"}
                {submitState !== "sending" && (
                  <ArrowRight
                    aria-hidden="true"
                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  />
                )}
              </button>

              <p
                role="status"
                aria-live="polite"
                className={
                  "mt-4 min-h-6 text-sm font-semibold " +
                  (submitState === "error"
                    ? "text-red-700"
                    : submitState === "success"
                      ? "text-teal"
                      : "text-ridge")
                }
              >
                {statusMessage}
              </p>
              <p className="mt-2 text-xs leading-5 text-ridge">
                Your note goes directly to N45. For urgent assistance, call{" "}
                <a
                  href="tel:+18285151530"
                  className="font-bold text-ink underline underline-offset-2"
                >
                  (828) 515-1530
                </a>
                .
              </p>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  autoComplete,
  maxLength,
}: {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  maxLength?: number;
}) {
  const id = "contact-" + name;
  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required
        autoComplete={autoComplete}
        maxLength={maxLength}
        className="field-control"
      />
    </div>
  );
}

function ContactDetail({
  icon: Icon,
  label,
  href,
  children,
}: {
  icon: LucideIcon;
  label: string;
  href?: string;
  children: ReactNode;
}) {
  const content = (
    <span className="text-base font-extrabold text-ink">{children}</span>
  );
  return (
    <div className="flex items-center gap-4">
      <span className="grid h-10 w-10 place-items-center rounded-full border border-ink/15">
        <Icon aria-hidden="true" className="h-4 w-4" />
      </span>
      <div>
        <dt className="font-mono text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-ink/75">
          {label}
        </dt>
        <dd className="mt-1">
          {href ? (
            <a href={href} className="hover:text-teal">
              {content}
            </a>
          ) : (
            content
          )}
        </dd>
      </div>
    </div>
  );
}

function Eyebrow({
  children,
  theme = "light",
}: {
  children: ReactNode;
  theme?: "light" | "dark" | "warm";
}) {
  const accentClass =
    theme === "dark"
      ? "text-mint"
      : theme === "warm"
        ? "text-ink"
        : "text-teal";
  const lineClass =
    theme === "dark" ? "bg-mint" : theme === "warm" ? "bg-ink" : "bg-teal";

  return (
    <div
      className={
        "flex items-center gap-3 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.22em] " +
        accentClass
      }
    >
      <span className={"h-px w-8 " + lineClass} />
      {children}
    </div>
  );
}

function Footer() {
  return (
    <footer className="bg-ink py-12 text-paper">
      <div className="mx-auto flex max-w-[88rem] flex-col gap-10 px-5 md:px-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <img
            src="/assets/n45-lockup-light.svg"
            alt="N45 Technology Solutions"
            className="h-16 w-auto"
          />
          <p className="mt-6 max-w-md text-sm leading-6 text-paper/55">
            Reliable support, safer systems, and clear documentation for Western
            North Carolina businesses.
          </p>
        </div>

        <div className="flex flex-col items-start gap-7 lg:items-end">
          <RemoteSupportButton />

          <div className="flex flex-col gap-4 text-sm text-paper/60 sm:flex-row sm:flex-wrap sm:items-center sm:gap-8 lg:justify-end">
            <a
              href="/managed-it-services-asheville/"
              className="hover:text-mint"
            >
              Ongoing IT Support
            </a>
            <a
              href="/business-it-support-western-nc/"
              className="hover:text-mint"
            >
              Business IT Support
            </a>
            <a
              href="/cybersecurity-services-asheville/"
              className="hover:text-mint"
            >
              Business Security
            </a>
            <a href="/ai-automation/" className="hover:text-mint">
              AI &amp; Automation
            </a>
            <a href="tel:+18285151530" className="hover:text-mint">
              (828) 515-1530
            </a>
            <a href="mailto:hello@n45tech.com" className="hover:text-mint">
              hello@n45tech.com
            </a>
            <a href="/blog/" className="hover:text-mint">
              Field Notes
            </a>
            <a href="/book/?service=it-call" className="hover:text-mint">
              Book
            </a>
            <a href="/refer/" className="hover:text-mint">
              Refer a business
            </a>
            <a href="/privacy/" className="hover:text-mint">
              Privacy
            </a>
            <span>© {new Date().getFullYear()} N45 Tech</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

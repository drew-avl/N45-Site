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
};

const services: Service[] = [
  {
    icon: Laptop,
    number: "01",
    title: "Managed IT support",
    body: "Day-to-day support, patching, device standards, and thoughtful onboarding that keeps your team moving.",
    outcome: "Fewer repeat problems. Faster, calmer workdays.",
  },
  {
    icon: KeyRound,
    number: "02",
    title: "Microsoft 365 & identity",
    body: "MFA, account lifecycle, shared mailboxes, admin cleanup, and safer sign-in built around how your people work.",
    outcome: "The right access for the right people.",
  },
  {
    icon: ShieldCheck,
    number: "03",
    title: "Practical cybersecurity",
    body: "Endpoint protection, least-privilege access, security reviews, alert routing, and validated backups.",
    outcome: "Real controls, clearly prioritized—no scare tactics.",
  },
  {
    icon: Network,
    number: "04",
    title: "Networks & infrastructure",
    body: "Wi-Fi, switching, firewalls, DNS, servers, and the physical path connecting your people to their work.",
    outcome: "A stable foundation from the front desk to the field.",
  },
  {
    icon: FileCheck2,
    number: "05",
    title: "Continuity & documentation",
    body: "Assets, vendors, accounts, recovery steps, and ownership captured in one dependable operating record.",
    outcome: "Critical knowledge that never lives in one person’s head.",
  },
  {
    icon: Workflow,
    number: "06",
    title: "Automation & operations",
    body: "Repeated tasks, tickets, alerts, and onboarding steps turned into clean, trackable workflows.",
    outcome: "Less busywork. More consistency.",
  },
];

const industries = [
  {
    icon: HeartPulse,
    label: "Healthcare",
    title: "Clinics, dental & specialty practices",
    body: "HIPAA-aware Microsoft 365, encrypted devices, reliable EHR and practice-management connectivity, and clear access records.",
    points: ["Identity & device controls", "Vendor and PHI documentation"],
  },
  {
    icon: Scale,
    label: "Professional firms",
    title: "Legal, accounting & advisory teams",
    body: "Confidential file access, dependable backups, and steady support through tax season, closings, and trial preparation.",
    points: ["MFA and admin cleanup", "Secure client workflows"],
  },
  {
    icon: UtensilsCrossed,
    label: "Hospitality",
    title: "Hotels, restaurants, taprooms & venues",
    body: "Guest and back-of-house Wi-Fi, segmented POS networks, and documented systems built for your busiest nights.",
    points: ["Guest and operations separation", "POS and kiosk reliability"],
  },
  {
    icon: Hammer,
    label: "Industry & trades",
    title: "Manufacturers, contractors & field crews",
    body: "Quiet infrastructure for office, shop, and remote teams—with rugged device management and accountable support.",
    points: ["Site-to-site connectivity", "Field-ready device standards"],
  },
];

const process = [
  {
    number: "01",
    title: "Listen & assess",
    body: "We learn how the business works, then map accounts, assets, vendors, ownership, risks, and recurring friction.",
  },
  {
    number: "02",
    title: "Stabilize the essentials",
    body: "Urgent issues get handled first. We reduce repeat problems and establish a dependable baseline.",
  },
  {
    number: "03",
    title: "Secure & document",
    body: "Access, devices, protection, backups, and recovery details become safer, clearer, and easier to manage.",
  },
  {
    number: "04",
    title: "Manage & improve",
    body: "Monitoring, support, reviews, and automation keep the environment useful as your business changes.",
  },
];

const faqs = [
  {
    question: "Do you replace our current IT provider?",
    answer:
      "N45 can become your managed IT partner or work through a scoped transition. The first step is understanding what is working, what is not, and what your team actually needs.",
  },
  {
    question: "Is N45 only for Asheville businesses?",
    answer:
      "N45 is based in Leicester and serves organizations across Asheville and Western North Carolina, including Hendersonville, Black Mountain, and the I-26 corridor.",
  },
  {
    question: "Can you help with one specific project?",
    answer:
      "Yes. Microsoft 365 cleanup, security reviews, network improvements, documentation, and automation can all begin as focused projects when that is the right fit.",
  },
  {
    question: "What happens during an IT review?",
    answer:
      "We start with a practical conversation about your team, systems, risks, and recurring problems. From there, N45 identifies the highest-value next steps without forcing an oversized package.",
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
    <div className="min-h-screen overflow-x-clip bg-paper text-ink">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <Nav />
      <main id="main-content">
        <Hero />
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
        </nav>

        <a
          href="#contact"
          className="group inline-flex items-center gap-1.5 rounded-full bg-ink px-3 py-2.5 text-sm font-bold text-paper transition hover:bg-spruce sm:gap-2 sm:px-5"
        >
          <span className="hidden sm:inline">Plan an IT review</span>
          <span className="sm:hidden">Talk</span>
          <ArrowRight
            aria-hidden="true"
            className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
          />
        </a>
      </div>
    </header>
  );
}

function HeaderLogo() {
  return (
    <a
      href="#top"
      aria-label="N45 Technology Solutions home"
      className="flex shrink-0 items-center gap-2.5 sm:gap-3"
    >
      <img
        src="/assets/n45-mark.svg"
        alt=""
        aria-hidden="true"
        className="h-12 w-12 shrink-0 lg:h-14 lg:w-14"
      />
      <span>
        <span className="flex items-baseline gap-2 whitespace-nowrap leading-none text-ink sm:gap-2.5 lg:gap-3">
          <span className="text-2xl font-extrabold tracking-[-0.06em] lg:text-[1.7rem]">
            N45
          </span>
          <span className="text-[0.67rem] font-extrabold tracking-[-0.025em] sm:text-xs lg:text-sm">
            Technology Solutions
          </span>
        </span>
        <span className="mt-1 block h-px w-full bg-ink/15" />
        <span className="mt-1 hidden whitespace-nowrap font-mono text-[0.5rem] font-semibold uppercase tracking-[0.1em] text-ridge sm:block lg:text-[0.56rem]">
          Asheville Area · Western North Carolina
        </span>
      </span>
    </a>
  );
}

function Hero() {
  return (
    <section
      id="top"
      className="relative isolate min-h-[44rem] bg-ink text-paper"
    >
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

      <div className="mx-auto grid min-h-[44rem] max-w-[88rem] items-center gap-16 px-5 py-16 md:px-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(22rem,.6fr)] lg:py-20">
        <div className="max-w-4xl">
          <Eyebrow theme="dark">Asheville-based · Western NC focused</Eyebrow>
          <h1 className="mt-7 max-w-4xl font-display text-[clamp(3.25rem,6.4vw,6.25rem)] leading-[0.93] tracking-[-0.045em] text-balance">
            Steady IT for the people building{" "}
            <em className="font-display font-normal text-mint">
              Western North Carolina.
            </em>
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-8 text-paper/78 md:text-xl">
            N45 brings secure, responsive, plainspoken IT support to independent
            businesses across Asheville and the mountains—without jargon, scare
            tactics, or mystery.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <a href="#contact" className="button-primary group">
              Start with an IT review
              <ArrowRight
                aria-hidden="true"
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
              />
            </a>
            <a href="tel:+18285151530" className="button-ghost-light group">
              <Phone aria-hidden="true" className="h-4 w-4" />
              (828) 515-1530
            </a>
          </div>

          <div className="mt-12 flex flex-wrap gap-x-8 gap-y-3 text-sm font-semibold text-paper/70">
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
            Secure.
            <br />
            Documented.
            <br />
            Managed.
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
            <span>
              Local to Leicester. Serving greater Asheville and Western North
              Carolina.
            </span>
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
    <section className="relative bg-paper py-24 md:py-32">
      <div className="mx-auto max-w-[88rem] px-5 md:px-8">
        <div className="grid gap-12 lg:grid-cols-[.9fr_1.1fr] lg:items-end">
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

        <div className="mt-16 grid overflow-hidden rounded-[2rem] border border-ink/10 bg-ink/10 md:grid-cols-3 md:gap-px">
          {outcomes.map((outcome) => (
            <article key={outcome.number} className="bg-mist p-7 md:p-9">
              <div className="font-mono text-xs font-semibold text-teal">
                {outcome.number}
              </div>
              <h3 className="mt-8 font-display text-3xl tracking-tight">
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
    <section id="services" className="bg-ink py-24 text-paper md:py-32">
      <div className="mx-auto max-w-[88rem] px-5 md:px-8">
        <div className="grid gap-12 lg:grid-cols-[.68fr_1.32fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Eyebrow theme="dark">What we manage</Eyebrow>
            <h2 className="mt-6 font-display text-5xl leading-[0.98] tracking-tight text-balance md:text-6xl">
              Your whole environment, with no black box.
            </h2>
            <p className="mt-6 max-w-md text-lg leading-8 text-paper/68">
              Good IT should feel almost invisible: fewer interruptions, safer
              decisions, and clear answers when something changes.
            </p>
            <a href="#contact" className="button-outline-mint mt-9">
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
                  <h3 className="mt-8 font-display text-3xl tracking-tight">
                    {service.title}
                  </h3>
                  <p className="mt-4 leading-7 text-paper/62">{service.body}</p>
                  <p className="mt-7 border-t border-white/10 pt-5 text-sm font-bold leading-6 text-mint">
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
    <section id="industries" className="bg-paper py-24 md:py-32">
      <div className="mx-auto max-w-[88rem] px-5 md:px-8">
        <div className="max-w-4xl">
          <Eyebrow>Built for Western North Carolina</Eyebrow>
          <h2 className="mt-6 font-display text-5xl leading-[0.98] tracking-tight text-balance md:text-7xl">
            Technology shaped around how local business actually runs.
          </h2>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-ridge">
            N45 stays close to the operations we understand—places where trust,
            uptime, confidentiality, and a real human response matter.
          </p>
        </div>

        <div className="mt-16 grid gap-5 md:grid-cols-2">
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
                <h3 className="mt-8 max-w-lg font-display text-3xl leading-tight tracking-tight md:text-4xl">
                  {industry.title}
                </h3>
                <p className="mt-5 max-w-xl leading-7 text-ridge">
                  {industry.body}
                </p>
                <ul className="mt-8 grid gap-3 border-t border-ink/10 pt-6 sm:grid-cols-2">
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
      className="relative overflow-hidden bg-mist py-24 md:py-32"
    >
      <div className="absolute inset-x-0 bottom-0 h-64 bg-[url('/assets/ridge-pattern.svg')] bg-cover bg-bottom opacity-50" />
      <div className="relative mx-auto max-w-[88rem] px-5 md:px-8">
        <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:gap-24">
          <div>
            <Eyebrow>A practical path forward</Eyebrow>
            <h2 className="mt-6 font-display text-5xl leading-[0.98] tracking-tight text-balance md:text-7xl">
              From reactive to ready, one clear step at a time.
            </h2>
            <p className="mt-7 max-w-lg text-lg leading-8 text-ridge">
              N45 fixes the foundation before stacking on more tools. The result
              is easier to manage, easier to support, and more resilient over
              time.
            </p>
          </div>

          <ol className="overflow-hidden rounded-[2rem] border border-ink/10 bg-paper shadow-[0_24px_80px_rgba(10,36,35,0.08)]">
            {process.map((item) => (
              <li key={item.number} className="process-row">
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
                </div>
                <ChevronRight
                  aria-hidden="true"
                  className="mt-2 hidden h-5 w-5 text-teal/50 sm:block"
                />
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
      className="relative overflow-hidden bg-spruce py-24 text-paper md:py-32"
    >
      <div className="absolute inset-0 bg-[url('/assets/ridge-pattern.svg')] bg-cover bg-center opacity-35" />
      <div className="relative mx-auto grid max-w-[88rem] gap-14 px-5 md:px-8 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:gap-24">
        <div>
          <Eyebrow theme="dark">Why N45</Eyebrow>
          <h2 className="mt-6 max-w-3xl font-display text-5xl leading-[0.98] tracking-tight text-balance md:text-7xl">
            Rooted here. Built to show up.
          </h2>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-paper/70">
            Asheville businesses value craft, independence, and relationships
            that hold up over time. N45 brings that same mentality to IT: do the
            work carefully, explain it plainly, and stay accountable after the
            urgent moment has passed.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <a href="#contact" className="button-primary group">
              Meet your local IT partner
              <ArrowRight
                aria-hidden="true"
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
              />
            </a>
            <a href="mailto:hello@n45tech.com" className="button-ghost-light">
              <Mail aria-hidden="true" className="h-4 w-4" />
              Email N45
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
          <div className="mt-7 flex items-start gap-3 text-sm leading-6 text-paper/60">
            <MapPin
              aria-hidden="true"
              className="mt-0.5 h-4 w-4 shrink-0 text-sunrise"
            />
            <span>2520 New Leicester Highway, Ste 9 · Leicester, NC 28748</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  return (
    <section className="bg-paper py-24 md:py-32">
      <div className="mx-auto grid max-w-[88rem] gap-14 px-5 md:px-8 lg:grid-cols-[.72fr_1.28fr] lg:gap-24">
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
        "The contact form is not configured yet. Call N45 at (828) 515-1530.",
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
    <section id="contact" className="bg-sunrise py-24 md:py-32">
      <div className="mx-auto grid max-w-[88rem] gap-14 px-5 md:px-8 lg:grid-cols-[.82fr_1.18fr] lg:gap-24">
        <div>
          <Eyebrow>Start a conversation</Eyebrow>
          <h2 className="mt-6 font-display text-5xl leading-[0.98] tracking-tight text-balance md:text-7xl">
            Tell us what feels messy, risky, or unclear.
          </h2>
          <p className="mt-7 max-w-lg text-lg leading-8 text-ink/70">
            We will start with the business problem, look at the systems behind
            it, and give you a practical next step. No jargon-heavy pitch
            required.
          </p>

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
            <ContactDetail icon={MapPin} label="Based in">
              Leicester, North Carolina
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
                defaultValue=""
                className="field-control"
              >
                <option value="" disabled>
                  Select one
                </option>
                <option value="IT review / current provider concerns">
                  IT review / current provider
                </option>
                <option value="Microsoft 365 / account security">
                  Microsoft 365 / account security
                </option>
                <option value="Managed IT support">Managed IT support</option>
                <option value="Cybersecurity / endpoint protection">
                  Cybersecurity / endpoint protection
                </option>
                <option value="Network or infrastructure issue">
                  Network or infrastructure
                </option>
                <option value="Automation / documentation cleanup">
                  Automation / documentation
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
        <dt className="font-mono text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-ink/55">
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
  theme?: "light" | "dark";
}) {
  return (
    <div
      className={
        "flex items-center gap-3 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.22em] " +
        (theme === "dark" ? "text-mint" : "text-teal")
      }
    >
      <span
        className={"h-px w-8 " + (theme === "dark" ? "bg-mint" : "bg-teal")}
      />
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
            Secure, documented, managed IT for the people building Western North
            Carolina.
          </p>
        </div>

        <div className="flex flex-col gap-4 text-sm text-paper/60 sm:flex-row sm:items-center sm:gap-8">
          <a href="tel:+18285151530" className="hover:text-mint">
            (828) 515-1530
          </a>
          <a href="mailto:hello@n45tech.com" className="hover:text-mint">
            hello@n45tech.com
          </a>
          <span>© {new Date().getFullYear()} N45 Tech</span>
        </div>
      </div>
    </footer>
  );
}

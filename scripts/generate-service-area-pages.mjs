import { mkdirSync, writeFileSync } from "node:fs";

const SITE = "https://n45tech.com";

export const serviceAreas = [
  {
    city: "Hendersonville",
    slug: "managed-it-services-hendersonville",
    county: "Henderson County",
    lead: "Steady technology support for the offices, practices, shops, hospitality teams, and growing organizations that keep Hendersonville working.",
    context:
      "From downtown offices to teams spread along the I-26 corridor, Hendersonville businesses need technology that stays dependable through busy seasons and ordinary workdays alike.",
    focus: [
      "Professional and healthcare offices",
      "Hospitality, retail, and visitor-facing teams",
      "Multi-site organizations across Henderson County",
    ],
    nearby:
      "Laurel Park, Flat Rock, Etowah, and the wider Henderson County area",
  },
  {
    city: "Arden",
    slug: "managed-it-services-arden",
    county: "Buncombe County",
    lead: "Responsive IT support for Arden businesses that need reliable systems, safer accounts, and one accountable local partner.",
    context:
      "Arden sits at the center of a busy commercial and industrial corridor. N45 supports office, warehouse, medical, service, and field teams whose work cannot pause for recurring computer or network problems.",
    focus: [
      "Office and warehouse technology",
      "Microsoft 365 access and employee setup",
      "Networks connecting front office, floor, and field",
    ],
    nearby: "Royal Pines, Biltmore Park, Avery Creek, and South Asheville",
  },
  {
    city: "Fletcher",
    slug: "managed-it-services-fletcher",
    county: "Henderson County",
    lead: "Practical IT support for Fletcher organizations—from everyday employee help to networks, Microsoft 365, security, and documentation.",
    context:
      "Fletcher businesses often connect offices, production space, warehouses, and field staff. N45 helps keep those moving parts supported under one clear, documented plan.",
    focus: [
      "Manufacturing and distribution teams",
      "Professional offices and service businesses",
      "Multi-location and field operations",
    ],
    nearby: "Cane Creek, Hoopers Creek, Arden, and northern Henderson County",
  },
  {
    city: "Weaverville",
    slug: "managed-it-services-weaverville",
    county: "Buncombe County",
    lead: "Local IT support for Weaverville businesses that want fewer interruptions, clearer ownership, and technology built for steady growth.",
    context:
      "Weaverville combines independent businesses, professional offices, nonprofits, and teams serving customers across northern Buncombe County. N45 provides remote speed with local help when equipment or networks need hands in the room.",
    focus: [
      "Independent and professional businesses",
      "Nonprofits and community organizations",
      "Remote and hybrid teams north of Asheville",
    ],
    nearby: "Woodfin, Reems Creek, Barnardsville, and northern Buncombe County",
  },
  {
    city: "Black Mountain",
    slug: "managed-it-services-black-mountain",
    county: "Buncombe County",
    lead: "Dependable IT support for Black Mountain businesses, nonprofits, hospitality teams, and professional offices.",
    context:
      "Black Mountain organizations balance year-round operations with seasonal demand. N45 keeps accounts, work computers, Wi-Fi, vendors, and recovery plans organized so technology does not become the bottleneck.",
    focus: [
      "Hospitality and visitor-facing businesses",
      "Nonprofits and community organizations",
      "Professional offices and distributed teams",
    ],
    nearby: "Montreat, Swannanoa, Ridgecrest, and the Swannanoa Valley",
  },
  {
    city: "Leicester",
    slug: "managed-it-services-leicester",
    county: "Buncombe County",
    lead: "Straightforward IT support for Leicester businesses and organizations that need responsive help without a large internal IT department.",
    context:
      "Teams west of Asheville still need fast support, consistent computer setup, secure cloud access, and a practical plan when connectivity or equipment fails. N45 combines remote service with local on-site support when needed.",
    focus: [
      "Small offices and local service companies",
      "Contractors and field-based teams",
      "Organizations working across Leicester and Asheville",
    ],
    nearby: "Newfound, Sandy Mush, West Asheville, and western Buncombe County",
  },
  {
    city: "Mills River",
    slug: "managed-it-services-mills-river",
    county: "Henderson County",
    lead: "Business IT support for Mills River teams that rely on connected offices, facilities, equipment, and field operations.",
    context:
      "Mills River organizations often need technology to work across offices, production or warehouse space, and people in the field. N45 brings those systems under one support and documentation standard.",
    focus: [
      "Manufacturing, distribution, and facilities",
      "Agriculture and field operations",
      "Professional and service businesses",
    ],
    nearby: "Etowah, Horse Shoe, Fletcher, and western Henderson County",
  },
  {
    city: "Brevard",
    slug: "managed-it-services-brevard",
    county: "Transylvania County",
    lead: "Reliable IT support for Brevard businesses, professional offices, nonprofits, and hospitality organizations.",
    context:
      "Brevard teams need remote support that responds quickly and a regional partner who can plan on-site work when networks, facilities, or equipment require it. N45 keeps the arrangement clear and documented.",
    focus: [
      "Professional and healthcare offices",
      "Hospitality and outdoor-industry teams",
      "Nonprofits and community organizations",
    ],
    nearby: "Pisgah Forest, Rosman, Cedar Mountain, and Transylvania County",
  },
  {
    city: "Waynesville",
    slug: "managed-it-services-waynesville",
    county: "Haywood County",
    lead: "Clear, accountable IT support for Waynesville businesses that need reliable technology and a regional partner who understands Western North Carolina.",
    context:
      "Waynesville organizations often support customers, employees, and facilities across Haywood County. N45 provides responsive remote help, planned on-site service, and the documentation needed to keep responsibilities clear.",
    focus: [
      "Professional and healthcare offices",
      "Hospitality, retail, and service businesses",
      "Organizations with teams across Haywood County",
    ],
    nearby: "Lake Junaluska, Clyde, Maggie Valley, and greater Haywood County",
  },
  {
    city: "Marion",
    slug: "managed-it-services-marion",
    county: "McDowell County",
    lead: "Practical managed IT and day-to-day technology support for Marion businesses, nonprofits, and operational teams.",
    context:
      "Marion organizations need dependable access to the same tools as larger markets without adding a full internal IT department. N45 supports employees remotely and plans local visits for network, equipment, and facilities work.",
    focus: [
      "Manufacturing and operational teams",
      "Professional offices and local services",
      "Nonprofits and community organizations",
    ],
    nearby: "Old Fort, Nebo, Pleasant Gardens, and McDowell County",
  },
];

const areaLinks = [
  { city: "Asheville", slug: "managed-it-services-asheville" },
  ...serviceAreas.map(({ city, slug }) => ({ city, slug })),
];

function escapeJson(value) {
  return JSON.stringify(value, null, 2).replace(/</g, "\\u003c");
}

function page(area) {
  const url = `${SITE}/${area.slug}/`;
  const title = `IT Support & Managed IT Services in ${area.city}, NC | N45`;
  const htmlTitle = title.replaceAll("&", "&amp;");
  const description = `Local IT support for ${area.city}, NC businesses, including Microsoft 365, cybersecurity, computers, networks, backups, vendors, and documentation.`;
  const faq = [
    {
      question: `Does N45 provide on-site IT support in ${area.city}?`,
      answer: `Yes. N45 resolves many employee and software issues remotely for speed and can plan on-site service in ${area.city} for network, hardware, office, and facilities work.`,
    },
    {
      question: `Can N45 serve as our outsourced IT department in ${area.city}?`,
      answer:
        "Yes. N45 can manage day-to-day support, devices, Microsoft 365, cybersecurity, networks, vendors, backup checks, documentation, onboarding, and offboarding under a clearly documented scope.",
    },
    {
      question:
        "Can we begin with a focused project instead of ongoing service?",
      answer:
        "Yes. A Microsoft 365 security review, account cleanup, network improvement, documentation project, or another defined need can be a practical first step.",
    },
  ];
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: `IT Support and Managed IT Services in ${area.city}, NC`,
        serviceType: [
          "Managed IT services",
          "Outsourced IT support",
          "Cybersecurity services",
        ],
        provider: { "@id": `${SITE}/#organization` },
        url,
        areaServed: [
          { "@type": "City", name: area.city },
          { "@type": "AdministrativeArea", name: area.county },
          { "@type": "AdministrativeArea", name: "Western North Carolina" },
        ],
        description,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
          {
            "@type": "ListItem",
            position: 2,
            name: "Service Areas",
            item: `${SITE}/business-it-support-western-nc/`,
          },
          { "@type": "ListItem", position: 3, name: area.city, item: url },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
    ],
  };
  const otherAreas = areaLinks
    .filter((item) => item.city !== area.city)
    .map(
      (item) =>
        `<a class="area-link" href="/${item.slug}/"><span>${item.city}</span><span class="font-mono text-xs text-teal">View area</span></a>`,
    )
    .join("\n");

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${htmlTitle}</title>
    <meta name="description" content="${description}" />
    <meta name="robots" content="index,follow,max-image-preview:large" />
    <link rel="canonical" href="${url}" />
    <meta property="og:title" content="${htmlTitle}" />
    <meta property="og:description" content="${area.lead}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="N45 Technology Solutions" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${SITE}/assets/hero-mountains.jpg" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="theme-color" content="#0a2423" />
    <link rel="icon" href="/assets/favicon.svg" type="image/svg+xml" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500;600&family=Manrope:wght@400;500;600;700;800&family=Newsreader:opsz,wght@6..72,500;6..72,600&display=swap" />
    <link rel="stylesheet" href="/src/styles.css" />
    <script type="application/ld+json">${escapeJson(schema)}</script>
  </head>
  <body>
    <div class="min-h-screen overflow-x-clip bg-paper text-ink">
      <a class="skip-link" href="#main-content">Skip to main content</a>
      <header class="sticky top-0 z-50 border-b border-ink/10 bg-paper/95 backdrop-blur-xl">
        <div class="bg-ink text-paper"><div class="mx-auto flex h-9 max-w-[88rem] items-center justify-center px-4 sm:justify-end sm:px-5 md:px-8"><a href="tel:+18285151530" aria-label="Call N45 Technology Solutions at (828) 515-1530" class="font-mono text-xs font-semibold tracking-[0.06em] text-paper transition hover:text-mint">Call N45: (828) 515-1530</a></div></div>
        <div class="mx-auto flex h-20 max-w-[88rem] items-center justify-between gap-3 px-4 sm:gap-6 sm:px-5 md:px-8">
          <a href="/" aria-label="N45 Technology Solutions home" class="block shrink-0"><img src="/assets/n45-lockup-dark.svg" alt="" aria-hidden="true" class="header-logo h-12 w-auto sm:h-14 lg:h-16" /></a>
          <nav aria-label="Primary navigation" class="hidden items-center gap-6 text-sm font-semibold text-ridge lg:flex xl:gap-7">
            <a class="nav-link" href="/#services">Services</a><a class="nav-link" href="/#industries">Industries</a><a class="nav-link" href="/#approach">Approach</a><a class="nav-link" href="/#about">Why N45</a><a class="nav-link" href="/business-it-support-western-nc/" aria-current="page">Service Areas</a><a class="nav-link" href="/blog/">Field Notes</a>
          </nav>
          <div class="flex items-center gap-2">
            <a href="/book/?service=it-call" class="group inline-flex min-h-11 items-center gap-1.5 rounded-full bg-ink px-3 py-2.5 text-sm font-bold text-paper transition hover:bg-spruce sm:gap-2 sm:px-5"><span class="hidden sm:inline">Book a conversation</span><span class="sm:hidden">Book</span></a>
            <details class="mobile-nav" data-mobile-nav><summary><span class="sr-only">Site menu</span><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" class="mobile-nav-menu-icon h-5 w-5"><path d="M4 6h16M4 12h16M4 18h16" /></svg><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" class="mobile-nav-close-icon h-5 w-5"><path d="M6 6l12 12M18 6 6 18" /></svg></summary><div class="mobile-nav-panel"><nav aria-label="Mobile navigation"><a class="mobile-nav-link" href="/#services" data-mobile-nav-link>Services</a><a class="mobile-nav-link" href="/#industries" data-mobile-nav-link>Industries</a><a class="mobile-nav-link" href="/#approach" data-mobile-nav-link>Approach</a><a class="mobile-nav-link" href="/#about" data-mobile-nav-link>Why N45</a><a class="mobile-nav-link" href="/business-it-support-western-nc/" aria-current="page" data-mobile-nav-link>Service Areas</a><a class="mobile-nav-link" href="/blog/" data-mobile-nav-link>Field Notes</a><a class="mobile-nav-link" href="/refer/" data-mobile-nav-link>Refer a business</a></nav><a href="https://support.n45tech.com/" target="_blank" rel="noopener noreferrer" class="mobile-nav-support" data-mobile-nav-link>Start Remote Support<span class="sr-only"> (opens in a new tab)</span></a></div></details>
          </div>
        </div>
      </header>
      <main id="main-content">
        <section class="relative isolate min-h-[40rem] bg-ink text-paper">
          <div class="absolute inset-0 -z-20"><img src="/assets/hero-mountains.jpg" alt="Layered Blue Ridge Mountains at sunrise" width="1920" height="1080" class="h-full w-full object-cover object-[58%_center]" /></div><div class="hero-overlay absolute inset-0 -z-10"></div><div class="absolute inset-0 -z-10 bg-[url('/assets/ridge-pattern.svg')] bg-bottom bg-no-repeat opacity-30 mix-blend-screen"></div>
          <div class="mx-auto flex min-h-[40rem] max-w-[88rem] items-center px-5 py-20 md:px-8">
            <div class="max-w-4xl">
              <nav aria-label="Breadcrumb" class="text-sm font-semibold text-paper/70"><ol class="flex flex-wrap items-center gap-2"><li><a class="hover:text-mint" href="/">Home</a></li><li aria-hidden="true">/</li><li><a class="hover:text-mint" href="/business-it-support-western-nc/">Service Areas</a></li><li aria-hidden="true">/</li><li aria-current="page" class="text-mint">${area.city}</li></ol></nav>
              <h1 class="mt-8 max-w-4xl font-display text-[clamp(3rem,6vw,5.75rem)] leading-[0.95] tracking-[-0.04em] text-balance">IT support for <em class="font-display font-normal text-mint">${area.city} businesses.</em></h1>
              <p class="mt-8 max-w-2xl text-lg leading-8 text-paper/78 md:text-xl">${area.lead}</p>
              <div class="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center"><a href="/book/?service=it-call" class="button-primary">Talk through your IT needs</a><a href="tel:+18285151530" class="button-ghost-light">Call (828) 515-1530</a></div>
              <p class="mt-10 max-w-2xl border-l-2 border-sunrise pl-5 text-sm leading-7 text-paper/70">Remote support is usually fastest. On-site service is available in ${area.city} and nearby communities when equipment, cabling, networks, or facilities need hands-on work.</p>
            </div>
          </div>
        </section>
        <section class="bg-paper py-20 md:py-28">
          <div class="mx-auto grid max-w-[88rem] gap-14 px-5 md:px-8 lg:grid-cols-[.76fr_1.24fr] lg:gap-24">
            <div><h2 class="font-display text-5xl leading-[0.98] tracking-[-0.035em] text-balance md:text-6xl">One place to turn when technology interrupts the workday.</h2><p class="mt-7 max-w-xl text-lg leading-8 text-ridge">${area.context}</p><p class="mt-5 max-w-xl text-sm leading-7 text-ridge">N45 serves ${area.city}, ${area.nearby}. Service scope and on-site response expectations are agreed before work begins.</p></div>
            <div class="divide-y divide-ink/12 border-y border-ink/12">
              <article class="py-7 md:grid md:grid-cols-[10rem_1fr] md:gap-8"><h3 class="font-display text-2xl">Everyday support</h3><p class="mt-3 leading-7 text-ridge md:mt-0">Help with Microsoft 365, sign-ins, email, software, printers, internet access, and work computers—plus attention to the cause when the same issue keeps returning.</p></article>
              <article class="py-7 md:grid md:grid-cols-[10rem_1fr] md:gap-8"><h3 class="font-display text-2xl">Safer systems</h3><p class="mt-3 leading-7 text-ridge md:mt-0">Account protection, endpoint security, appropriate access, backup checks, and practical risk priorities without fear-based selling.</p></article>
              <article class="py-7 md:grid md:grid-cols-[10rem_1fr] md:gap-8"><h3 class="font-display text-2xl">Clear ownership</h3><p class="mt-3 leading-7 text-ridge md:mt-0">Documented equipment, vendors, accounts, onboarding, offboarding, and recovery steps so critical knowledge does not live in one person’s head.</p></article>
            </div>
          </div>
        </section>
        <section class="bg-mist py-20 md:py-28">
          <div class="mx-auto max-w-[88rem] px-5 md:px-8">
            <div class="grid gap-12 lg:grid-cols-[.72fr_1.28fr] lg:gap-20"><div><h2 class="font-display text-5xl leading-[0.98] tracking-[-0.035em] text-balance md:text-6xl">Support shaped around how ${area.city} teams work.</h2><p class="mt-7 max-w-lg text-lg leading-8 text-ridge">The right plan depends on the work, the systems behind it, and what an interruption costs—not a one-size-fits-all technology bundle.</p></div><ul class="grid gap-4 sm:grid-cols-3">${area.focus.map((item) => `<li class="rounded-[1.25rem] bg-paper p-6 shadow-[0_16px_50px_rgba(10,36,35,0.08)]"><span class="block h-1 w-10 bg-sunrise"></span><span class="mt-8 block font-display text-2xl leading-tight">${item}</span></li>`).join("")}</ul></div>
          </div>
        </section>
        <section class="bg-ink py-20 text-paper md:py-28">
          <div class="mx-auto grid max-w-[88rem] gap-12 px-5 md:px-8 lg:grid-cols-[.8fr_1.2fr] lg:gap-24"><div><h2 class="font-display text-5xl leading-[0.98] tracking-[-0.035em] text-balance md:text-6xl">Start with the problem you need solved.</h2><p class="mt-7 max-w-lg text-lg leading-8 text-paper/70">N45 can become your ongoing IT partner or begin with a focused, clearly scoped project.</p></div><div class="grid gap-4 sm:grid-cols-2"><a class="service-card" href="/managed-it-services-asheville/"><h3 class="font-display text-3xl">Managed IT services</h3><p class="mt-4 leading-7 text-paper/65">Ongoing employee support, device management, Microsoft 365, vendors, security, and planning.</p></a><a class="service-card" href="/cybersecurity-services-asheville/"><h3 class="font-display text-3xl">Business security</h3><p class="mt-4 leading-7 text-paper/65">Practical protection for accounts, computers, email, access, backups, and recovery.</p></a><a class="service-card sm:col-span-2" href="/ai-automation/"><h3 class="font-display text-3xl">AI &amp; automation</h3><p class="mt-4 max-w-2xl leading-7 text-paper/65">Useful automation, AI assistants, training, and oversight grounded in the way your team actually works.</p></a></div></div>
        </section>
        <section class="bg-paper py-20 md:py-28">
          <div class="mx-auto grid max-w-[88rem] gap-14 px-5 md:px-8 lg:grid-cols-[.72fr_1.28fr] lg:gap-24"><div><h2 class="font-display text-5xl leading-[0.98] tracking-[-0.035em] md:text-6xl">Questions from ${area.city} businesses.</h2></div><div class="divide-y divide-ink/12 border-y border-ink/12">${faq.map((item) => `<details class="faq group"><summary><span>${item.question}</span><span class="faq-icon" aria-hidden="true">+</span></summary><p>${item.answer}</p></details>`).join("")}</div></div>
        </section>
        <section class="bg-mist py-20 md:py-24">
          <div class="mx-auto max-w-[88rem] px-5 md:px-8"><div class="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"><div><h2 class="font-display text-4xl tracking-[-0.03em] md:text-5xl">More N45 service areas</h2><p class="mt-3 text-ridge">Explore local support across Western North Carolina.</p></div><a class="text-link font-bold" href="/business-it-support-western-nc/">View the Western North Carolina service-area hub</a></div><div class="area-grid mt-10 grid border-t border-ink/12 sm:grid-cols-2 lg:grid-cols-5">${otherAreas}</div></div>
        </section>
        <section class="relative overflow-hidden bg-spruce py-20 text-paper"><div class="absolute inset-0 bg-[url('/assets/ridge-pattern.svg')] bg-cover bg-center opacity-35"></div><div class="relative mx-auto flex max-w-[88rem] flex-col gap-8 px-5 md:px-8 lg:flex-row lg:items-center lg:justify-between"><div><h2 class="max-w-4xl font-display text-4xl leading-tight tracking-[-0.035em] md:text-6xl">Bring the recurring issue, unclear setup, or project no one owns.</h2><p class="mt-5 text-paper/70">A short conversation is enough to identify the most practical next step.</p></div><a class="button-primary shrink-0" href="/book/?service=it-call">Book a conversation</a></div></section>
      </main>
      <footer class="bg-ink py-12 text-paper"><div class="mx-auto flex max-w-[88rem] flex-col gap-10 px-5 md:px-8 lg:flex-row lg:items-end lg:justify-between"><div><img src="/assets/n45-lockup-light.svg" alt="N45 Technology Solutions" class="h-16 w-auto" /><p class="mt-6 max-w-md text-sm leading-6 text-paper/55">Reliable support, safer systems, and clear documentation for Western North Carolina businesses.</p></div><div class="flex flex-col items-start gap-7 lg:items-end"><a href="https://support.n45tech.com/" target="_blank" rel="noopener noreferrer" class="button-primary">Start Remote Support<span class="sr-only"> (opens in a new tab)</span></a><div class="flex flex-col gap-4 text-sm text-paper/60 sm:flex-row sm:flex-wrap sm:items-center sm:gap-8 lg:justify-end"><a href="/business-it-support-western-nc/" class="hover:text-mint">Service Areas</a><a href="/managed-it-services-asheville/" class="hover:text-mint">Ongoing IT Support</a><a href="/cybersecurity-services-asheville/" class="hover:text-mint">Business Security</a><a href="/ai-automation/" class="hover:text-mint">AI &amp; Automation</a><a href="/book/" class="hover:text-mint">Book a conversation</a><a href="tel:+18285151530" class="hover:text-mint">(828) 515-1530</a><a href="mailto:hello@n45tech.com" class="hover:text-mint">hello@n45tech.com</a><a href="/blog/" class="hover:text-mint">Field Notes</a><a href="/privacy/" class="hover:text-mint">Privacy</a><a href="/sms-terms/" class="hover:text-mint">SMS Terms</a><span>© ${new Date().getFullYear()} N45 Tech</span></div></div></div></footer>
    </div>
  </body>
</html>\n`;
}

for (const area of serviceAreas) {
  mkdirSync(area.slug, { recursive: true });
  writeFileSync(`${area.slug}/index.html`, page(area));
}

console.log(`Generated ${serviceAreas.length} service-area pages.`);

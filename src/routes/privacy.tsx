import { PageEyebrow, SiteFooter, SiteHeader } from "@/components/SiteChrome";

const sections = [
  {
    title: "Information you provide",
    body: (
      <>
        <p>
          When you contact N45, submit a referral, or schedule a conversation,
          you may provide information such as your name, organization, email
          address, phone number, and details about the reason for your inquiry.
          Scheduling information submitted through Microsoft Bookings is also
          handled under Microsoft&apos;s applicable privacy terms.
        </p>
      </>
    ),
  },
  {
    title: "Website analytics",
    body: (
      <>
        <p>
          N45 uses Google Analytics 4 to understand how visitors find and use
          this website. The standard implementation may collect page views,
          interactions, approximate location, browser and device information,
          and a client identifier stored in a first-party cookie. N45 does not
          intentionally send names, email addresses, phone numbers, or message
          contents to Google Analytics.
        </p>
        <p>
          Learn more about how Google processes information from sites that use
          its services at{" "}
          <a
            href="https://policies.google.com/technologies/partner-sites"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-teal underline decoration-teal/35 hover:decoration-teal"
          >
            Google&apos;s partner sites information page
          </a>
          .
        </p>
      </>
    ),
  },
  {
    title: "How information is used",
    body: (
      <p>
        N45 uses information to respond to inquiries, provide requested
        services, manage appointments and referrals, operate and protect the
        website, understand marketing performance, and improve its services.
      </p>
    ),
  },
  {
    title: "Service providers and disclosure",
    body: (
      <p>
        N45 may share information with service providers used for website
        hosting, security, analytics, communications, and scheduling, but only
        as reasonably necessary for those services. N45 does not sell personal
        information. Information may also be disclosed when required by law or
        when reasonably necessary to protect N45, its customers, or others.
      </p>
    ),
  },
  {
    title: "Retention and security",
    body: (
      <p>
        N45 retains information only as long as reasonably necessary for the
        purposes described here, business recordkeeping, and applicable legal
        obligations. Reasonable administrative and technical safeguards are
        used, although no internet transmission or storage system can be
        guaranteed completely secure.
      </p>
    ),
  },
  {
    title: "Your choices",
    body: (
      <>
        <p>
          You can limit cookies through your browser settings or use the{" "}
          <a
            href="https://tools.google.com/dlpage/gaoptout"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-teal underline decoration-teal/35 hover:decoration-teal"
          >
            Google Analytics opt-out browser add-on
          </a>
          . Disabling cookies may affect how some websites function.
        </p>
        <p>
          To ask about, correct, or request deletion of information you have
          provided directly to N45, email{" "}
          <a
            href="mailto:hello@n45tech.com"
            className="font-semibold text-teal underline decoration-teal/35 hover:decoration-teal"
          >
            hello@n45tech.com
          </a>
          .
        </p>
      </>
    ),
  },
];

export default function Privacy() {
  return (
    <div className="min-h-screen overflow-x-clip bg-paper text-ink">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <SiteHeader />

      <main id="main-content">
        <section className="bg-ink py-16 text-paper md:py-24">
          <div className="mx-auto max-w-[88rem] px-5 md:px-8">
            <PageEyebrow theme="dark">Privacy</PageEyebrow>
            <h1 className="mt-7 max-w-4xl font-display text-[clamp(3rem,7vw,5.5rem)] leading-[0.96] tracking-[-0.035em] text-balance">
              Clear information about how this site uses data.
            </h1>
            <p className="mt-7 max-w-3xl text-lg leading-8 text-paper/76 md:text-xl">
              N45 collects only the information needed to respond, schedule,
              operate the website, and understand which outreach is useful.
            </p>
            <p className="mt-6 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-mint">
              Effective August 28, 2026
            </p>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="mx-auto grid max-w-[88rem] gap-12 px-5 md:px-8 lg:grid-cols-[minmax(14rem,.42fr)_minmax(0,1fr)] lg:gap-20">
            <aside className="lg:sticky lg:top-36 lg:self-start">
              <h2 className="font-display text-3xl leading-tight tracking-[-0.02em]">
                N45, LLC
              </h2>
              <p className="mt-4 max-w-sm text-sm leading-6 text-ridge">
                Doing business as N45 Technology Solutions and serving
                organizations across Western North Carolina.
              </p>
              <address className="mt-6 text-sm not-italic leading-7 text-ridge">
                2520 New Leicester Highway, Suite 9
                <br />
                Leicester, NC 28748
                <br />
                <a href="mailto:hello@n45tech.com" className="hover:text-teal">
                  hello@n45tech.com
                </a>
              </address>
            </aside>

            <div className="divide-y divide-ink/12 border-y border-ink/12">
              {sections.map((section) => (
                <section key={section.title} className="py-8 md:py-10">
                  <h2 className="font-display text-3xl leading-tight tracking-[-0.02em] md:text-4xl">
                    {section.title}
                  </h2>
                  <div className="mt-5 max-w-3xl space-y-5 leading-7 text-ridge">
                    {section.body}
                  </div>
                </section>
              ))}

              <section className="py-8 md:py-10">
                <h2 className="font-display text-3xl leading-tight tracking-[-0.02em] md:text-4xl">
                  Updates to this notice
                </h2>
                <p className="mt-5 max-w-3xl leading-7 text-ridge">
                  N45 may update this notice when its services or data practices
                  change. The effective date above will be revised when an
                  update is published.
                </p>
              </section>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

import { PageEyebrow, SiteFooter, SiteHeader } from "@/components/SiteChrome";

const sections = [
  {
    title: "Program description",
    body: (
      <>
        <p>
          The N45 Operational Alerts program provides non-promotional,
          event-driven text messages from N45 Technology Solutions. Messages to
          customers may include service outages, degraded service, monitoring or
          security incidents, scheduled maintenance, incident status updates,
          support communications, and service-restoration notices.
        </p>
        <p>
          Authorized N45 personnel who choose text messaging as an on-call
          notification method may also receive incident assignments,
          escalations, acknowledgment requests, status updates, and resolution
          notices.
        </p>
      </>
    ),
  },
  {
    title: "Enrollment and consent",
    body: (
      <>
        <p>
          Recipients enroll by providing a mobile number and giving separate,
          affirmative consent through an N45 customer or staff onboarding
          process, notification settings, or another documented enrollment
          method. Recipients may also enroll when offered by texting an approved
          opt-in keyword, such as START or ALERTS, to the N45 messaging number.
        </p>
        <p>
          Consent to receive text messages is optional and is not a condition of
          purchasing N45 services. Alternative notification methods may be
          available. N45 does not send program messages before consent is
          recorded.
        </p>
      </>
    ),
  },
  {
    title: "Message frequency and charges",
    body: (
      <p>
        Message frequency varies based on operational events and may temporarily
        increase during an active incident or outage. Message and data rates may
        apply according to your wireless plan. N45 does not charge a separate
        fee for receiving these messages.
      </p>
    ),
  },
  {
    title: "Opt out and help",
    body: (
      <>
        <p>
          Reply STOP to any N45 text message to unsubscribe. After processing
          the request, N45 will send a confirmation and no further program
          messages will be sent to that mobile number unless the recipient
          enrolls again.
        </p>
        <p>
          Reply HELP for assistance, or email{` `}
          <a
            href="mailto:hello@n45tech.com"
            className="font-semibold text-teal underline decoration-teal/35 hover:decoration-teal"
          >
            hello@n45tech.com
          </a>
          . Unsubscribing from SMS does not cancel services or prevent N45 from
          communicating through other agreed channels.
        </p>
      </>
    ),
  },
  {
    title: "Privacy",
    body: (
      <p>
        N45 does not sell or share mobile phone numbers, text-message opt-in
        information, or text-message consent with third parties or affiliates
        for marketing or promotional purposes. Information about N45&apos;s data
        practices is available in the{` `}
        <a
          href="/privacy/"
          className="font-semibold text-teal underline decoration-teal/35 hover:decoration-teal"
        >
          Privacy Notice
        </a>
        .
      </p>
    ),
  },
  {
    title: "Delivery and availability",
    body: (
      <p>
        Wireless carriers are not liable for delayed or undelivered messages.
        Text messages are provided as an additional notification channel and
        should not be treated as the only source of information during an
        outage, security incident, or emergency. Delivery may be affected by
        carrier availability, network conditions, device settings, or other
        circumstances outside N45&apos;s control.
      </p>
    ),
  },
  {
    title: "Changes to these terms",
    body: (
      <p>
        N45 may update these terms when the messaging program, applicable law,
        or carrier requirements change. The effective date on this page will be
        revised when an update is published. Continued enrollment after an
        update means the recipient remains subject to the updated terms.
      </p>
    ),
  },
];

export default function SmsTerms() {
  return (
    <div className="min-h-screen overflow-x-clip bg-paper text-ink">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <SiteHeader />

      <main id="main-content">
        <section className="bg-ink py-16 text-paper md:py-24">
          <div className="mx-auto max-w-[88rem] px-5 md:px-8">
            <PageEyebrow theme="dark">SMS terms</PageEyebrow>
            <h1 className="mt-7 max-w-4xl font-display text-[clamp(3rem,7vw,5.5rem)] leading-[0.96] tracking-[-0.035em] text-balance">
              Terms for N45 operational text messages.
            </h1>
            <p className="mt-7 max-w-3xl text-lg leading-8 text-paper/76 md:text-xl">
              These terms explain enrollment, message frequency, opt-out
              instructions, privacy, and support for the N45 Operational Alerts
              program.
            </p>
            <p className="mt-6 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-mint">
              Effective September 14, 2026
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
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

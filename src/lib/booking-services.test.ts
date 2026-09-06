import assert from "node:assert/strict";
import test from "node:test";

import {
  bookingServiceDisplayName,
  bookingServiceDescription,
  bookingServiceIntent,
  initialBookingServiceId,
} from "./booking-services.ts";

const services = [
  {
    id: "managed-it",
    name: "Managed IT Introduction",
    description: "A focused first conversation.",
  },
  {
    id: "security",
    name: "Microsoft 365 Security Fit Check",
    description: "See whether the $495 security triage fits.",
  },
];

test("the default booking link keeps the first service selected", () => {
  assert.equal(initialBookingServiceId(services), "managed-it");
});

test("the security-review link selects the security service", () => {
  assert.equal(
    initialBookingServiceId(services, "security-review"),
    "security",
  );
});

test("the security-review link also recognizes the proposed service name", () => {
  assert.equal(
    initialBookingServiceId(
      [
        services[0],
        {
          id: "renamed-security",
          name: "See if the $495 account-security review fits",
          description: "A focused fit check.",
        },
      ],
      "security-review",
    ),
    "renamed-security",
  );
});

test("technical provider names are translated for customers", () => {
  assert.equal(
    bookingServiceDisplayName("Managed IT Introduction"),
    "Talk through your IT needs",
  );
  assert.equal(
    bookingServiceDisplayName("Microsoft 365 Security Fit Check"),
    "Microsoft security review fit call",
  );
});

test("unrecognized service names remain unchanged", () => {
  assert.equal(
    bookingServiceDisplayName("Planning session"),
    "Planning session",
  );
});

test("call links select the IT conversation even when the API order changes", () => {
  assert.equal(
    initialBookingServiceId([...services].reverse(), "it-call"),
    "managed-it",
  );
});

test("a missing requested service never silently books the other service", () => {
  assert.equal(initialBookingServiceId([services[0]], "security-review"), "");
  assert.equal(initialBookingServiceId([services[1]], "it-call"), "");
  assert.equal(initialBookingServiceId([], "security-review"), "");
});

test("an unknown conversation keeps its actual name and description", () => {
  const service = {
    id: "project",
    name: "Planning session",
    description: "Discuss an office move.",
  };
  assert.equal(bookingServiceIntent(service), undefined);
  assert.equal(bookingServiceDescription(service), service.description);
});

test("the review conversation cannot be mistaken for purchasing the paid review", () => {
  assert.equal(bookingServiceIntent(services[1]), "security-review");
  assert.match(bookingServiceDisplayName(services[1].name), /fit call/);
  assert.match(
    bookingServiceDescription(services[1]),
    /Booking this call does not purchase the review/,
  );
});

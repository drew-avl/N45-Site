import assert from "node:assert/strict";
import test from "node:test";

import {
  bookingServiceDisplayName,
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
    "See if the $495 account-security review fits",
  );
});

test("unrecognized service names remain unchanged", () => {
  assert.equal(
    bookingServiceDisplayName("Planning session"),
    "Planning session",
  );
});

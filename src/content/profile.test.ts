import { describe, expect, it } from "vitest";
import { emailComposeUrl, profile } from "./profile";

describe("profile", () => {
  it("builds a Gmail compose link addressed to the profile email", () => {
    const url = new URL(emailComposeUrl);
    expect(url.hostname).toBe("mail.google.com");
    expect(url.searchParams.get("to")).toBe(profile.email);
  });

  it("has a hiring notification for the menu bar", () => {
    expect(profile.notification.message).toContain("Full Stack Developer");
  });

  it("does not publish a phone number", () => {
    expect(JSON.stringify(profile)).not.toMatch(/\+?\d[\d\s-]{8,}\d/);
  });
});

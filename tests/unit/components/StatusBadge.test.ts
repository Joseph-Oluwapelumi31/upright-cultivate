import { describe, it, expect } from "vitest";
import { STATUS_TONES } from "../../../components/ui/StatusBadge";

describe("StatusBadge Component Logic", () => {
  it("maps PENDING to warning", () => {
    expect(STATUS_TONES.PENDING).toBe("warning");
  });

  it("maps UNDER_REVIEW to info", () => {
    expect(STATUS_TONES.UNDER_REVIEW).toBe("info");
  });

  it("maps ACCEPTED to success", () => {
    expect(STATUS_TONES.ACCEPTED).toBe("success");
  });

  it("maps REJECTED to error", () => {
    expect(STATUS_TONES.REJECTED).toBe("error");
  });

  it("maps CANCELLED to neutral", () => {
    expect(STATUS_TONES.CANCELLED).toBe("neutral");
  });
});

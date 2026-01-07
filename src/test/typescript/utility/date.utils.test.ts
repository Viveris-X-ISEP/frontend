import {
  hasOneMonthPassed,
  hasDaysPassed,
  formatDateFr,
} from "../../../main/typescript/utility/date.utils";

describe("Date Utility Functions", () => {
  describe("hasOneMonthPassed", () => {
    it("should return true if more than 30 days have passed", () => {
      // Create a date 31 days ago
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 31);
      const result = hasOneMonthPassed(pastDate.toISOString());
      expect(result).toBe(true);
    });

    it("should return false if less than 30 days have passed", () => {
      // Create a date 29 days ago
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 29);
      const result = hasOneMonthPassed(pastDate.toISOString());
      expect(result).toBe(false);
    });

    it("should return true if exactly 30 days have passed (boundary case)", () => {
      // Create a date exactly 30 days ago (boundary case - should return true because >= 30)
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 30);
      const result = hasOneMonthPassed(pastDate.toISOString());
      expect(result).toBe(true);
    });

    it("should return false for invalid date string", () => {
      const result = hasOneMonthPassed("invalid-date");
      expect(result).toBe(false);
    });

    it("should return false for future date", () => {
      // Create a date 1 day in the future
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      const result = hasOneMonthPassed(futureDate.toISOString());
      expect(result).toBe(false);
    });

    it("should work with date strings in different formats", () => {
      // ISO 8601 format
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 35);
      const result = hasOneMonthPassed(pastDate.toISOString());
      expect(result).toBe(true);
    });
  });

  describe("hasDaysPassed", () => {
    it("should return true if more than specified days have passed", () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 10);
      const result = hasDaysPassed(pastDate.toISOString(), 5);
      expect(result).toBe(true);
    });

    it("should return false if less than specified days have passed", () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 3);
      const result = hasDaysPassed(pastDate.toISOString(), 5);
      expect(result).toBe(false);
    });

    it("should return true if exactly the specified days have passed", () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 5);
      const result = hasDaysPassed(pastDate.toISOString(), 5);
      expect(result).toBe(true);
    });

    it("should return false for invalid date string", () => {
      const result = hasDaysPassed("invalid-date", 5);
      expect(result).toBe(false);
    });

    it("should work with 0 days", () => {
      const now = new Date();
      const result = hasDaysPassed(now.toISOString(), 0);
      expect(result).toBe(true);
    });

    it("should work with large number of days", () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 400);
      const result = hasDaysPassed(pastDate.toISOString(), 365);
      expect(result).toBe(true);
    });
  });

  describe("formatDateFr", () => {
    it("should format date string in French format", () => {
      const dateString = "2025-12-11T00:00:00.000Z";
      const result = formatDateFr(dateString);
      // Note: The exact output might vary based on locale settings
      expect(result).toContain("2025");
      expect(result).toContain("11");
    });

    it("should return Invalid Date string for invalid date", () => {
      const invalidDate = "invalid-date";
      const result = formatDateFr(invalidDate);
      expect(result).toBe("Invalid Date");
    });

    it("should format different dates correctly", () => {
      const dateString = "2025-01-15T00:00:00.000Z";
      const result = formatDateFr(dateString);
      expect(result).toContain("2025");
      expect(result).toContain("15");
    });

    it("should handle ISO 8601 format", () => {
      const date = new Date("2025-12-11");
      const result = formatDateFr(date.toISOString());
      expect(result).toBeTruthy();
      expect(typeof result).toBe("string");
    });
  });
});

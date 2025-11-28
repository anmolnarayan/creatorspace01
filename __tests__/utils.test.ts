import { generateSlug, formatDate } from "@/lib/utils";

describe("Utils", () => {
  describe("generateSlug", () => {
    it("should generate a valid slug from text", () => {
      expect(generateSlug("Hello World")).toBe("hello-world");
      expect(generateSlug("Test Project 123")).toBe("test-project-123");
      expect(generateSlug("Special@Chars#Here")).toBe("specialcharshere");
    });
  });

  describe("formatDate", () => {
    it("should format dates correctly", () => {
      const date = new Date("2024-01-15");
      const formatted = formatDate(date);
      expect(formatted).toContain("January");
      expect(formatted).toContain("2024");
    });
  });
});


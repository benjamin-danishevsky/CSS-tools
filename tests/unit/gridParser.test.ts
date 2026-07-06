import { describe, it, expect } from "vitest";
import { parseTrackString, trackToString } from "../../src/lib/gridParser";

describe("gridParser", () => {
  describe("parseTrackString", () => {
    it("parses a single fr value", () => {
      const result = parseTrackString("1fr");
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({ value: 1, unit: "fr" });
    });

    it("parses multiple mixed values", () => {
      const result = parseTrackString("1fr 200px auto");
      expect(result).toHaveLength(3);
      expect(result[0]).toMatchObject({ value: 1, unit: "fr" });
      expect(result[1]).toMatchObject({ value: 200, unit: "px" });
      expect(result[2]).toMatchObject({ value: 0, unit: "auto" });
    });

    it("parses percentage values", () => {
      const result = parseTrackString("50% 1fr");
      expect(result).toHaveLength(2);
      expect(result[0]).toMatchObject({ value: 50, unit: "%" });
      expect(result[1]).toMatchObject({ value: 1, unit: "fr" });
    });

    it("parses fractional fr values", () => {
      const result = parseTrackString("1.5fr 2fr");
      expect(result).toHaveLength(2);
      expect(result[0]).toMatchObject({ value: 1.5, unit: "fr" });
      expect(result[1]).toMatchObject({ value: 2, unit: "fr" });
    });

    it("handles extra whitespace", () => {
      const result = parseTrackString("  1fr   200px  ");
      expect(result).toHaveLength(2);
      expect(result[0]).toMatchObject({ value: 1, unit: "fr" });
      expect(result[1]).toMatchObject({ value: 200, unit: "px" });
    });

    it("returns empty array for empty string", () => {
      expect(parseTrackString("")).toHaveLength(0);
      expect(parseTrackString("   ")).toHaveLength(0);
    });

    it("assigns unique ids to each track", () => {
      const result = parseTrackString("1fr 2fr 3fr");
      const ids = result.map((t) => t.id);
      expect(new Set(ids).size).toBe(3);
    });
  });

  describe("trackToString", () => {
    it("converts fr track to string", () => {
      expect(trackToString({ id: "1", value: 2, unit: "fr" })).toBe("2fr");
    });

    it("converts px track to string", () => {
      expect(trackToString({ id: "1", value: 200, unit: "px" })).toBe("200px");
    });

    it("converts percentage track to string", () => {
      expect(trackToString({ id: "1", value: 50, unit: "%" })).toBe("50%");
    });

    it("converts auto track to string", () => {
      expect(trackToString({ id: "1", value: 0, unit: "auto" })).toBe("auto");
    });

    it("handles fractional values", () => {
      expect(trackToString({ id: "1", value: 1.5, unit: "fr" })).toBe("1.5fr");
    });
  });
});

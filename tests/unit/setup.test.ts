import { describe, it, expect } from "vitest";

describe("project setup", () => {
  it("type definitions are importable", async () => {
    const types = await import("../../src/types/grid");
    expect(types).toBeDefined();
  });
});

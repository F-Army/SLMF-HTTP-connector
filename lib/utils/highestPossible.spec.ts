import { highestPossible } from "./highestPossible";

describe("Highest possible test", () => {
    it("should return the highest possible number", () => {
        expect(highestPossible(2000, 3000)).toBe(2000);
        expect(highestPossible(500, 200)).toBe(200);
    });
});

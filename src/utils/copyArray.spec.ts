import { copyArray } from "./copyArray";

describe("Copy Array test", () => {
    it("should copy array and not reference it", () => {
        const numbers: object[] = [{one: 1}, {two: 2}];

        const numbersCopy = copyArray(numbers);

        // Checks if they reference the same memory address
        expect(numbers === numbersCopy).toBe(false);

        expect(numbers[0] === numbersCopy[0]).toBe(true);
        expect(numbers[1] === numbersCopy[1]).toBe(true);
    });
});

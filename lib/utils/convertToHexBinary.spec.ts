import { convertToHexBinary } from "./convertToHexBinary";

describe("Convert to hexbinary test", () => {
    it("should output always hexbinary string with even number of chars", () => {
        expect(convertToHexBinary(256)).toBe("0100");
    });

    it("should not change hexbinary wich are even normally", () => {
        expect(convertToHexBinary(255)).toBe("ff");
    });
});

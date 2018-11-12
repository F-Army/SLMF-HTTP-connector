import { shiftMany } from "./shiftMany";

describe("ShiftMany test", () => {
    it("should shift the proper number of elements", () => {
        const arr = [2, 3, 4, 5];
        shiftMany(arr, 2);

        expect(arr).toMatchObject([4, 5]);
    });
});

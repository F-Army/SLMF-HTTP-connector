import { transferData } from "./transferData";

describe("Transfer Data test", () => {
    it("should transfer data correctly", () => {
        const first = [1, 2 , 3];
        const second = [4, 5, 6];

        const union = [...first, ...second];

        transferData(second, first, 3);

        expect(first).toMatchObject(union);
        expect(second).toMatchObject([]);
    });
});

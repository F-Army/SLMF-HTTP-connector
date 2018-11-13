import { removeUndefinedProperties } from "./removeUndefinedProperties";

describe("RemoveUndefinedProperties test", () => {
    it("should remove undefined properties", () => {
        const testObj = {
            ciao: "hello",
            salut: undefined,
        };

        removeUndefinedProperties(testObj);

        expect(testObj).toMatchObject({ciao: "hello"});
    });
});

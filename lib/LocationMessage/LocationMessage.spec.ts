"use strict";

import LocationMessage, { BatteryStatus, TagIdFormat } from "./LocationMessage";

/* tslint:disable:object-literal-sort-keys */

const locationData = {
    source: "Infrastructure",
    format: "DFT",
    tagIdFormat: TagIdFormat.IEEE_EUI_64,
    tagId: 0x01,
    position: {
        x: 0,
        y: 0,
        z: 0,
    },
    battery: BatteryStatus.Good,
    timestamp: new Date(),
};

describe("Location Message tests", () => {
    it("set correct data", (done) => {
        try {
            const location = new LocationMessage(locationData);
            expect(location.data).toMatchObject(locationData);
            done();
        } catch (error) {
            done("Should have validated");
        }
    });

    it("should error on invalid location data", (done) => {
        const badLocationData  = {...locationData, battery: 30 };

        try {
            const location = new LocationMessage(badLocationData);
            expect(location.data).toMatchObject(locationData);
            done("Shouldn't have validated");
        } catch (error) {
            done();
        }
    });
});

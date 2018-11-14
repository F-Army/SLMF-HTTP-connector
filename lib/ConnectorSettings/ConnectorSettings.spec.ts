"use strict";

import ConnectorSettings from "./ConnectorSettings";

describe("Configuration schema test", () => {
    it("should validate correct schema", (done) => {
        try {
            const validSettings = new ConnectorSettings({
                accumulationPeriod : 500,
                maxAccumulatedMessages : 1024,
                maxRetries : 15,
                maxSlmfMessages : 512,
                port : 80,
                url : "https://127.0.0.1",
            });
            done();
        } catch (error) {
            done("Should have validated");
        }
    });

    it("should give error with invalid schema", (done) => {

        try {
            const invalidSettings = new ConnectorSettings({
                accumulationPeriod : -500,
                maxAccumulatedMessages : -1024,
                maxRetries : -15,
                maxSlmfMessages : -512,
                port : 80,
                url : "httpas://127.0.0.1",
            });
            done("Shouldn't have validated");
        } catch (error) {
            done();
        }
    });

    it("should set port inside url correctly", () => {
        const urlSettings = new ConnectorSettings({
            accumulationPeriod : 500,
            maxAccumulatedMessages : 1024,
            maxRetries : 15,
            maxSlmfMessages : 512,
            url : "https://127.0.0.1/",
        });

        expect(urlSettings.url).toBe("https://127.0.0.1/");

        const urlSettings2 = new ConnectorSettings({
            accumulationPeriod : 500,
            maxAccumulatedMessages : 1024,
            maxRetries : 15,
            maxSlmfMessages : 512,
            port: 8080,
            url : "http://127.0.0.1/",
        });

        expect(urlSettings2.url).toBe("http://127.0.0.1:8080/");
    });
});

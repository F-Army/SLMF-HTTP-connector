"use strict";

import Joi from "joi";

import settingsSchema from "./settings";

describe("Configuration schema test", () => {
    it("should validate correct schema", () => {
        const settings = {
            accumulationPeriod : 500,
            maxAccumulatedMessages : 1024,
            maxRetries : 15,
            maxSlmfMessages : 512,
            port : 80,
            url : "https://127.0.0.1",
        };

        const { error, value } = Joi.validate(settings, settingsSchema);
        expect(error).toBeNull();
        expect(value).toBeDefined();
    });

    it("should give error with invalid schema", () => {
        const wrongSettings = {
            accumulationPeriod : -2,
            maxRetries : 1,
            maxSlmfMessages : 20148,
            port : "hello",
            url : "1212!!",
        };

        const { error } = Joi.validate(wrongSettings, settingsSchema);
        expect(error).toBeDefined();
    });
});

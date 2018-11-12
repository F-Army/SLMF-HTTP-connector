"use strict";

import Joi from "joi";

const DEFAULT_RETRIES: number = 3;

const schema = Joi.object().keys({
    accumulationPeriod: Joi.number().positive().required(),
    maxAccumulatedMessages: Joi.number().min(Joi.ref("maxSlmfMessages")).default(Joi.ref("maxSlmfMessages")),
    maxRetries: Joi.number().positive().default(DEFAULT_RETRIES),
    maxSlmfMessages: Joi.number().positive().min(0).max(1024).required(),
    port: Joi.number().positive().min(0).max(65535).required(),
    url: Joi.string().uri({scheme: ["http", "https"]}).required(),
});

class ConnectorSettings {
    public readonly accumulationPeriod: number;
    public readonly maxAccumulatedMessages: number;
    public readonly maxRetries: number;
    public readonly maxSlmfMessages: number;
    public readonly port: number;
    public readonly url: string;

    constructor(settings: {
        accumulationPeriod: number,
        maxAccumulatedMessages?: number,
        maxRetries?: number,
        maxSlmfMessages: number,
        port: number,
        url: string,
    }) {
            const validation = Joi.validate(settings, schema);

            if (validation.error) {
                throw new Error("Invalid settings");
            }

            this.accumulationPeriod = validation.value.accumulationPeriod;
            this.maxAccumulatedMessages = validation.value.maxAccumulatedMessages!;
            this.maxRetries = validation.value.maxRetries!;
            this.maxSlmfMessages = validation.value.maxSlmfMessages;
            this.port = validation.value.port;
            this.url = validation.value.url;
    }
}

export default ConnectorSettings;

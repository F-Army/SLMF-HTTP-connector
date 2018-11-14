"use strict";

import Joi from "joi";
import { URL } from "url";

export interface IConnectorSettings {
    accumulationPeriod: number;
    maxAccumulatedMessages: number;
    maxRetries?: number;
    maxSlmfMessages: number;
    port?: number;
    url: string;
}

const DEFAULT_RETRIES: number = 3;

const schema = Joi.object().keys({
    accumulationPeriod: Joi.number().positive().required(),
    maxAccumulatedMessages: Joi.number().min(Joi.ref("maxSlmfMessages")).default(Joi.ref("maxSlmfMessages")),
    maxRetries: Joi.number().positive().default(DEFAULT_RETRIES),
    maxSlmfMessages: Joi.number().positive().min(0).max(1024).required(),
    port: Joi.number().positive().min(0).max(65535),
    url: Joi.string().uri({scheme: ["http", "https"]}).required(),
});

export default class ConnectorSettings {
    public readonly accumulationPeriod: number;
    public readonly maxAccumulatedMessages: number;
    public readonly maxRetries: number;
    public readonly maxSlmfMessages: number;
    public readonly url: string;

    constructor(settings: IConnectorSettings) {
            const validation = Joi.validate(settings, schema);

            if (validation.error) {
                throw new Error("Invalid settings");
            }

            this.accumulationPeriod = validation.value.accumulationPeriod;
            this.maxAccumulatedMessages = validation.value.maxAccumulatedMessages!;
            this.maxRetries = validation.value.maxRetries!;
            this.maxSlmfMessages = validation.value.maxSlmfMessages;
            const url = new URL(settings.url);

            if (validation.value.port) {
                url.port = validation.value.port.toString();
            }

            this.url = url.toString();
    }
}

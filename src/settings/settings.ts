"use strict";

import Joi from "joi";

const schema = Joi.object().keys({
    accumulationPeriod: Joi.number().positive().required(),
    maxAccumulatedMessages: Joi.number().min(Joi.ref("maxSlmfMessages")).default(Joi.ref("maxSlmfMessages")),
    maxRetries: Joi.number().positive().default(3),
    maxSlmfMessages: Joi.number().positive().min(0).max(1024).required(),
    port: Joi.number().positive().min(0).max(65535).required(),
    url: Joi.string().uri({scheme: ["http", "https"]}).required(),
});

export default schema;

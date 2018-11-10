// @flow

'use strict'

import Joi from 'joi'

const schema = Joi.object().keys({
    url: Joi.string().uri({scheme: ['http', 'https']}).required(),
    port: Joi.number().positive().min(0).max(65535).required(),
    maxSlmfMessages: Joi.number().positive().min(0).max(1024).required(),
    accumulationPeriod: Joi.number().positive().required(),
    maxRetries: Joi.number().positive().default(3),
    maxAccumulatedMessages: Joi.number().min(Joi.ref('maxSlmfMessages')).default(Joi.ref('maxSlmfMessages'))
})

export default schema
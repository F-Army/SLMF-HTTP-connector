'use strict'

const Joi = require('joi')

const URL_REGEX = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?|^((http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/
const DEFAULT_MAX_RETRIES = 3

const configSchema = Joi.object().keys({
    url: Joi.string().regex(URL_REGEX).required(),
    port: Joi.number().positive().min(0).max(65535).required(),
    maxSlmfMessages: Joi.number().positive().min(0).max(1024).required(),
    accumulationPeriod: Joi.number().positive().required(),
    maxRetries: Joi.number().positive().default(DEFAULT_MAX_RETRIES),
    maxAccumulatedMessages: Joi.number().min(Joi.ref('maxSlmfMessages')).default(Joi.ref('maxSlmfMessages'))
})

module.exports = configSchema
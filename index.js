const Joi = require('joi')

const URL_REGEX = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/
const DEFAULT_MAX_RETRIES = 3

const configSchema = Joi.object().keys({
    url: Joi.string().regex(URL_REGEX).required(),
    port: Joi.number().positive().min(0).max(65535).required(),
    maxSlmfMessages: Joi.number().positive().min(0).max(1024).required(),
    accumulationPeriod: Joi.number().positive().required(),
    maxRetries: Joi.number().positive().default(DEFAULT_MAX_RETRIES),
    maxAccumulatedMessages: Joi.number().min(Joi.ref('maxSlmfMessages')).default(Joi.ref('maxSlmfMessages'))
})

module.exports = class SlmfHttpConnector {
    constructor(config) {

        const {error, value} = Joi.validate(config, configSchema)
        if (!error)
            this._config = value

        this._running = false
    }

    set config(config) {
        const {error, value} = Joi.validate(config, configSchema)
        if (!error)
            this._config = value
    }

    get config () { return this._config }

    isRunning () { return this._running }

    start () { this._running = true }

    stop () { this._running = false }
}

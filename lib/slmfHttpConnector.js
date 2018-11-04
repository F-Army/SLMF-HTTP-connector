'use strict'

const Joi = require('joi')

const configSchema = require('./models/configSchema')

module.exports = class SlmfHttpConnector {
    constructor(config) {
        this.config = config
        this._running = false
    }

    set config(config) {
        const { error, value } = Joi.validate(config, configSchema)
        !error ? this._config = value : this._config = null
        //TODO error handling
    }

    get config () { return this._config }

    isRunning () { return this._running }

    start () { this._running = true }

    stop () { this._running = false }
}

'use strict'

import Joi from 'joi'

import settingsSchema from '../settings'

class SlmfHttpConnector {
    constructor(settings) {
        this.settings = settings // N.B. this.settings not this._settings because it will use the set function
        this._running = false
    }

    set settings(settings) {
        const { error, value } = Joi.validate(settings, settingsSchema)
        if(!error)
            this._settings = value
        else
            throw new Error('Invalid settings')
    }

    get settings () { return this._settings }

    isRunning () { return this._running }

    start () { this._running = true }

    stop () { this._running = false }
}

export default SlmfHttpConnector

'use strict'

import Joi from 'joi'
import axios from 'axios'

import settingsSchema from '../settings'
import ConnectorLoop from '../connectorLoop'

class SlmfHttpConnector {
    constructor(settings) {
        this.settings = settings // N.B. this.settings not this._settings because it will use the set function
        this._running = false

        this._loop = new ConnectorLoop( async () => {
            await axios.post(this.settings.url, {data: 'data'})
        }, this.settings.accumulationPeriod)
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

    start () { 
        this._running = true 
        this._loop.start()
    }

    stop () { 
        this._running = false 
        this._loop.stop()
    }
}

export default SlmfHttpConnector

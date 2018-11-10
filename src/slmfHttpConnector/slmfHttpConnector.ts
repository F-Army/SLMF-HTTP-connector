'use strict'

import Joi from 'joi'
import axios from 'axios'

import settingsSchema from '../settings'
import ConnectorLoop from '../connectorLoop'
import Accumulator from '../accumulator'

import { copyArray } from '../utils'

class SlmfHttpConnector {

    _running
    _accumulator
    _loop
    _settings

    constructor(settings) {
        this.settings = settings // N.B. this.settings not this._settings because it will use the set function
        this._running = false
        this._accumulator = new Accumulator(this.settings.maxAccumulatedMessages)

        this._loop = new ConnectorLoop( async () => {
            if(this._accumulator.data.length > 0) {
                const messages = copyArray(this._accumulator.data)
                this._accumulator.clear()
                await axios.post(this.settings.url, {data: messages})
            }
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

    addMessages (...messages) {
        this._accumulator.add(...messages)
    }
}

export default SlmfHttpConnector

// @flow

'use strict'

import Joi from 'joi'
import axios from 'axios'

import settingsSchema from '../settings'
import ConnectorLoop from '../connectorLoop'
import Accumulator from '../accumulator'
import { copyArray } from '../utils'

class SlmfHttpConnector {
    _settings: {
        url: string,
        port: number,
        maxSlmfMessages: number,
        accumulationPeriod: number,
        maxRetries: number,
        maxAccumulatedMessages: number
    }
    _running: boolean
    _accumulator: Accumulator
    _loop: ConnectorLoop

    constructor(settings: {}): void {
        this.settings = settings // N.B. this.settings not this._settings because it will use the set function
        this._running = false
        this._accumulator = new Accumulator(this._settings.maxAccumulatedMessages)

        this._loop = new ConnectorLoop( async (): Promise<void> => {
            if(this._accumulator.data.length > 0) {
                const messages = copyArray(this._accumulator.data)
                this._accumulator.clear()
                await axios.post(this._settings.url, {data: messages})
            }
        }, this._settings.accumulationPeriod)
    }

    set settings(settings: {}): void {
        const { error, value } = Joi.validate(settings, settingsSchema)
        if(!error)
            this._settings = value
        else
            throw new Error('Invalid settings')
    }

    get settings (): {} { return this._settings }

    isRunning (): boolean { return this._running }

    start (): void { 
        this._running = true 
        this._loop.start()
    }

    stop (): void { 
        this._running = false 
        this._loop.stop()
    }

    addMessages (...messages: Array<{}>): void {
        this._accumulator.add(...messages)
    }
}

export default SlmfHttpConnector

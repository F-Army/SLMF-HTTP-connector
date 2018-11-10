'use strict'

import  Joi from 'joi'

import settingsSchema from '../lib/settings'

describe('Configuration schema test', () => {
    it('should validate correct schema', () => {
        const settings = {
            url : 'https://127.0.0.1',
            port : 80,
            maxSlmfMessages : 512,
            accumulationPeriod : 500,
            maxRetries : 15,
            maxAccumulatedMessages : 1024
        }

        const { error, value } = Joi.validate(settings, settingsSchema)
        expect(error).toBeNull()
        expect(value).toBeDefined()
    })

    it('should give error with invalid schema', () => {
        const wrongSettings = {
            url : '1212!!',
            port : 'hello',
            maxSlmfMessages : 20148,
            accumulationPeriod : -2,
            maxRetries : 1
        }

        const { error } = Joi.validate(wrongSettings, settingsSchema)
        expect(error).toBeDefined()
    })
})

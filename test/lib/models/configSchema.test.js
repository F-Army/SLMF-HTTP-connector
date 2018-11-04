const Joi = require('joi')

const configSchema = require('./../../../lib/models/configSchema')

describe('Configuration schema test', () => {
    it('should validate correct schema', () => {
        const cfg = {
            url : 'http://example2.com',
            port : 80,
            maxSlmfMessages : 512,
            accumulationPeriod : 500,
            maxRetries : 15,
            maxAccumulatedMessages : 1024
        }

        const { error, value } = Joi.validate(cfg, configSchema)
        expect(error).toBeNull()
        expect(value).toBeDefined()
    })

    it('should give error with invalid schema', () => {
        const wrongCfg = {
            url : '1212!!',
            port : "hello",
            maxSlmfMessages : 20148,
            accumulationPeriod : -2,
            maxRetries : 1
        }

        const { error } = Joi.validate(wrongCfg, configSchema)
        expect(error).toBeDefined()
    })
})
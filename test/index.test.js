const SlmfHttpConnector = require('./../index')

const config = {
    url : 'http://example.com',
    port : 80,
    maxSlmfMessages : 512,
    accumulationPeriod : 500,
    maxRetries : 15,
    maxAccumulatedMessages : 1024
}

const slmfHttpConnector = new SlmfHttpConnector(config)

describe("Simple starting tests", () => {
    it('should start stopped', () => {
        expect(slmfHttpConnector.isRunning()).toBe(false)
    })
    
    it('starts when told to do so', () => {
        slmfHttpConnector.start()
        expect(slmfHttpConnector.isRunning()).toBe(true)
    })
    
    it('stops when told to do so', () => {
        if(!slmfHttpConnector.isRunning())
            slmfHttpConnector.start()
        
        slmfHttpConnector.stop()
        expect(slmfHttpConnector.isRunning()).toBe(false)
    })

    it('should return a configuration', () => {
        const config = slmfHttpConnector.config
        expect(config).toHaveProperty('url')
        expect(config).toHaveProperty('port')
        expect(config).toHaveProperty('maxSlmfMessages')
        expect(config).toHaveProperty('accumulationPeriod')
        expect(config).toHaveProperty('maxRetries')
        expect(config).toHaveProperty('maxAccumulatedMessages')
    })

    it('should set the proper configuration', () => {
        const newConfig = {
            url : 'http://example2.com',
            port : 80,
            maxSlmfMessages : 512,
            accumulationPeriod : 500,
            maxRetries : 15,
            maxAccumulatedMessages : 1024
        }
        slmfHttpConnector.config = newConfig
        expect(slmfHttpConnector.config).toEqual(newConfig)
    })

})



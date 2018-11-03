const slmfHttpConnector = require('./../index.js')

describe("Simple starting tests", () => {
    it('should start stopped', () => {
        expect(slmfHttpConnector.isRunning()).toBe(false)
    })
    
    test('slmf starts when told to do so', () => {
        slmfHttpConnector.start()
        expect(slmfHttpConnector.isRunning()).toBe(true)
    })
    
    test('slmf stops when told to do so', () => {
        if(!slmfHttpConnector.isRunning())
            slmfHttpConnector.start()
        
        slmfHttpConnector.stop()
        expect(slmfHttpConnector.isRunning()).toBe(false)
    })
})



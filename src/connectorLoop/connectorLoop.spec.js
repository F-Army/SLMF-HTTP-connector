import ConnectorLoop from './connectorLoop'

const CALL_TIMES = 2
const INTERVAL = 5

describe('Connector loop test', () => {
    it('should call function multiple times in the time specified', async (done) => {
        const mockCalledFn = jest.fn()

        const connectorLoopTest = new ConnectorLoop(mockCalledFn, INTERVAL)

        connectorLoopTest.start()

        await setTimeout(() => {
            connectorLoopTest.stop()
            expect(mockCalledFn).toBeCalledTimes(CALL_TIMES)
            done()
        }, INTERVAL * CALL_TIMES + (INTERVAL / 3))

    })

    it('should call function multiple times in the time specified with the provided arguments', async (done) => {
        const mockCalledFnWithArguments = jest.fn((x, y) => x + y)

        const connectorLoopTest = new ConnectorLoop(mockCalledFnWithArguments, INTERVAL, 2, 3)
        
        connectorLoopTest.start()

        await setTimeout(() => {
            connectorLoopTest.stop()
            expect(mockCalledFnWithArguments).toBeCalledWith(2, 3)
            expect(mockCalledFnWithArguments).toBeCalledTimes(CALL_TIMES)
            expect(mockCalledFnWithArguments).toHaveReturnedTimes(CALL_TIMES)
            
            for(let callNum = 1; callNum <= CALL_TIMES; callNum++)
                expect(mockCalledFnWithArguments).toHaveNthReturnedWith(callNum, 5)
            
            done()
        }, INTERVAL * CALL_TIMES + (INTERVAL / 3))

    })
})

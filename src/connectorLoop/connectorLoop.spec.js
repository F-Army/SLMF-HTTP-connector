import ConnectorLoop from './connectorLoop'

const CALL_TIMES = 2
const INTERVAL = 5

jest.useFakeTimers()

describe('Connector loop test', () => {
    it('should call function multiple times in the time specified', () => {
        const mockCalledFn = jest.fn()

        const connectorLoopTest = new ConnectorLoop(mockCalledFn, INTERVAL)

        connectorLoopTest.start()

        jest.advanceTimersByTime(INTERVAL * CALL_TIMES)
        
        connectorLoopTest.stop()
        expect(mockCalledFn).toBeCalledTimes(CALL_TIMES)

    })

    it('should call function multiple times in the time specified with the provided arguments', () => {
        const mockCalledFnWithArguments = jest.fn((x, y) => x + y)

        const connectorLoopTest = new ConnectorLoop(mockCalledFnWithArguments, INTERVAL, 2, 3)
        
        connectorLoopTest.start()

        jest.advanceTimersByTime(INTERVAL * CALL_TIMES)

        connectorLoopTest.stop()
        expect(mockCalledFnWithArguments).toBeCalledWith(2, 3)
        expect(mockCalledFnWithArguments).toBeCalledTimes(CALL_TIMES)
        expect(mockCalledFnWithArguments).toHaveReturnedTimes(CALL_TIMES)
        
        for(let callNum = 1; callNum <= CALL_TIMES; callNum++)
        expect(mockCalledFnWithArguments).toHaveNthReturnedWith(callNum, 5)

    })

    it('should also call async functions correctly', () => {
        const asyncMockFn = jest.fn()

        const asyncFn = () => {
            setTimeout(asyncMockFn, 10)
        }

        const asyncConnectorLoop = new ConnectorLoop(asyncFn, 10)

        asyncConnectorLoop.start()

        jest.advanceTimersByTime(20)

        asyncConnectorLoop.stop()

        expect(asyncMockFn).toHaveBeenCalledTimes(1)
    })
})

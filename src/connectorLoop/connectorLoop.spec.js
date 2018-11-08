import connectorLoop from './connectorLoop'

describe('Connector loop test', () => {
    it('should call function multiple times in the time specified', async (done) => {
        const mockCalledFn = jest.fn()

        const connectorLoopTest = new connectorLoop(mockCalledFn, 100)

        connectorLoopTest.start()

        await setTimeout(() => {
            connectorLoopTest.stop()
            expect(mockCalledFn).toBeCalledTimes(4)
            done()
        }, 420)

    })
})
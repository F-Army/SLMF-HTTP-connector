'use strict'

jest.mock('axios')
jest.useFakeTimers()

import axios from 'axios'
import SlmfHttpConnector from './slmfHttpConnector'


const initialSettings = {
    url : 'http://127.0.0.1',
    port : 80,
    maxSlmfMessages : 512,
    accumulationPeriod : 500
}

const slmfHttpConnector = new SlmfHttpConnector(initialSettings)

describe('Slmf Http Connector tests', () => {
    beforeEach(() => {
        slmfHttpConnector.stop()
    })

    it('should start stopped', () => {
        expect(slmfHttpConnector.isRunning()).toBe(false)
    })
    
    it('starts when told to do so', () => {
        slmfHttpConnector.start()
        expect(slmfHttpConnector.isRunning()).toBe(true)
    })
    
    it('stops when told to do so', () => {
        slmfHttpConnector.start()
        slmfHttpConnector.stop()
        expect(slmfHttpConnector.isRunning()).toBe(false)
    })

    it('should set the proper configuration when valid', () => {
        const newSettings = {
            url : 'http://127.0.0.1',
            port : 8080,
            maxSlmfMessages : 512,
            accumulationPeriod : 500,
            maxRetries : 15,
            maxAccumulatedMessages : 1024
        }

        slmfHttpConnector.config = newSettings
        expect(slmfHttpConnector.config).toEqual(newSettings)
    })

    it('should throw error on invalid configuration set', () => {
        const wrongSettings = {
            url : 'random',
            port : -1,
            maxSlmfMessages : 512
        }
        try {
            slmfHttpConnector.config = wrongSettings
        } catch(error) {
            expect(error.message).toBe('Invalid configuration')
        }

    })

    it('should call send post request every time accumulationPeriod expires', () => {
        const postSettings = {
            url : 'http://127.0.0.1',
            port : 8080,
            maxSlmfMessages : 512,
            accumulationPeriod : 500,
            maxRetries : 15,
            maxAccumulatedMessages : 1024
        }

        slmfHttpConnector.settings = postSettings
        slmfHttpConnector.start()

        jest.advanceTimersByTime(slmfHttpConnector.settings.accumulationPeriod * 3)

        slmfHttpConnector.stop()

        expect(axios.post).toHaveBeenCalledTimes(3)


    })


})

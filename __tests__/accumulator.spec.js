'use strict'

import Accumulator from '../lib/accumulator'

describe('Accumulator tests', () => {
    it('should accumulate data', () => {
        const acc = new Accumulator(10)
        const object1 = {
            cat: 'test',
            dog: 'test2'
        }

        acc.add(object1)

        expect(acc.data[0]).toHaveProperty('cat')
        expect(acc.data[0]).toHaveProperty('dog')
    })

    it('shuld not accumulate data if it exceeeds max number of items', done => {
        const acc = new Accumulator(2)
        const abc = [{abc: 1}, {abc: 2}, {abc: 3}]

        try {
            acc.add(...abc)
            done('Should have not add items')
        } catch (error) {
            done()
        }
    })

    it('should clear data correctly', () => {
        const acc = new Accumulator(1)
        acc.add({spaghetti: 'mammamia'})
        
        acc.clear()

        expect(acc.data[0]).toBeUndefined()
    })
})
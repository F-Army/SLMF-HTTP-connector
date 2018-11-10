// @flow strict
'use strict'

class Accumulator {

    _maxItems: number
    _data: Array<{}>

    constructor(maxItems: number): void {
        this._maxItems = maxItems
        this._data = []
    }

    
    getData (): Array<{}> {
        return this._data
    }

    add (...items: Array<{}>): void {
        if( ( this._data.length + items.length) <= this._maxItems)
            this._data.push(...items)
        else
            throw new Error('Item limit excedeed')
    }

    clear (): void {
        this._data = []
    }
}

export default Accumulator
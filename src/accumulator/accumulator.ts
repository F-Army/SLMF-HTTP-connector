class Accumulator {
    constructor(maxItems) {
        this._maxItems = maxItems
        this._data = new Array()
    }

    get data () {
        return this._data
    }

    add (...items) {
        if( ( this._data.length + items.length) <= this._maxItems)
            this._data.push(...items)
        else
            throw new Error('Item limit excedeed')
    }

    clear () {
        this._data = new Array()
    }
}

export default Accumulator
class Accumulator {

    public maxItems;
    public items;

    constructor(maxItems) {
        this.maxItems = maxItems;
        this.items = new Array();
    }

    get data() {
        return this.items;
    }

    public add(...items) {
        if ( ( this.items.length + items.length) <= this.maxItems) {
            this.items.push(...items);
        } else {
            throw new Error("Item limit excedeed");
        }
    }

    public clear() {
        this.items = new Array();
    }
}

export default Accumulator;

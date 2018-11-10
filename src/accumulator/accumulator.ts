class Accumulator {

    public maxItems: number;
    public items: object[];

    constructor(maxItems: number) {
        this.maxItems = maxItems;
        this.items = [];
    }

    get data() {
        return this.items;
    }

    public add(...items: object[]) {
        if ( ( this.items.length + items.length) <= this.maxItems) {
            this.items.push(...items);
        } else {
            throw new Error("Item limit excedeed");
        }
    }

    public clear() {
        this.items = [];
    }
}

export default Accumulator;

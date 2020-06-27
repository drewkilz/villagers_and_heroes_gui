export class CraftingQuantity {
    constructor(total, stackSize) {
        this.total = total
        this.stackSize = stackSize
    }

    get remainder() {
        if (this.stackSize === null )
            return null

        return this.total - Math.trunc(this.total / this.stackSize) * this.stackSize
    }

    set remainder(value) {
        let difference = value - this.remainder
        this.total += difference
    }

    get stacks() {
        if (this.stackSize === null )
            return null

        return Math.trunc(this.total / this.stackSize)
    }

    set stacks(value) {
        let difference = value - this.stacks
        this.total += this.stackSize * difference
    }

    clone() {
        return new CraftingQuantity(this.total, this.stackSize)
    }
}

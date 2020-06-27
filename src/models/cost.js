export class Cost {
    constructor(total) {
        this.total = total
    }

    get gold() {
        return Math.trunc(this.total)
    }

    get silver() {
        return Math.trunc(this.total * 100 - this.gold * 100)
    }

    get copper() {
        return Math.trunc(this.total * 10000 - this.gold * 10000 - this.silver * 100)
    }

    clone() {
        return new Cost(this.total)
    }

    toString() {
        return `${this.gold}g, ${this.silver}s, ${this.copper}c`
    }
}

export function compareValues(key, order = 'asc') {
    return (a, b) => {
        if (!(key in a) || !(key in b)) {
            // property doesn't exist on either object
            return 0
        }

        const varA = (typeof a[key] === 'string')
            ? a[key].toUpperCase() : a[key]
        const varB = (typeof b[key] === 'string')
            ? b[key].toUpperCase() : b[key]

        let comparison = 0
        if (varA > varB) {
            comparison = 1
        } else if (varA < varB) {
            comparison = -1
        }
        return (
            (order === 'desc') ? (comparison * -1) : comparison
        )
    }
}

export class CraftingCost {
    constructor(total) {
        this.gold = Math.trunc(total)
        this.silver = Math.trunc(total * 100 - this.gold * 100)
        this.copper = Math.trunc(total * 10000 - this.gold * 10000 - this.silver * 100)
        this.total = total
    }
    toString() {
        return `${this.gold}g, ${this.silver}s, ${this.copper}c`
    }
}

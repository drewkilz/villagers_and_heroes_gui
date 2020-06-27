import { Item } from '@/models/item'

export class Ingredient {
    constructor() {
        this.item = null
        this.quantity = null
    }

    clone() {
        let ingredient = new Ingredient()

        ingredient.item = this.item ? this.item.clone() : this.item
        ingredient.quantity = this.quantity

        return ingredient
    }

    static fromJson(json) {
        if (!json)
            return null

        let ingredient = new Ingredient()

        ingredient.item = Item.fromJson(json.item)
        ingredient.quantity = json.quantity

        return ingredient
    }
}

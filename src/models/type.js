export class CraftingType {
    static COMPONENT = 'Crafting Components'
    static REFINED = 'Refined Ingredients'
}

export class ItemType {
    static COMPONENT = 'Crafting Component'
    static INGREDIENT = 'Crafting Ingredient'
}

export class Type {
    constructor() {
        this.id = null
        this.name = null

        this.categoryId = null
    }

    clone() {
        let type = new Type()

        type.id = this.id
        type.name = this.name

        type.categoryId = this.categoryId

        return type
    }

    static fromJson(json) {
        if (!json)
            return null

        let type = new Type()

        type.id = json.id
        type.name = json.name

        type.categoryId = json.category

        return type
    }
}

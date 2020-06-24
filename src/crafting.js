import { getItem, getRecipe } from "@/vnhApi"

let SALVAGE_KIT_NAME = 'Salvage Kit'

let ITEM_TYPE_COMPONENT = 'Crafting Component'
let ITEM_TYPE_INGREDIENT = 'Crafting Ingredient'

let CRAFTING_TYPE_COMPONENT = 'Crafting Components'
let CRAFTING_TYPE_REFINED = 'Refined Ingredients'

export class CraftingOptions {
    constructor(salvaging = false, ingredientSalvagePercent = 65, componentSalvagePercent = 20) {
        this.salvaging = salvaging

        // Default to 65% of Crafting Ingredients being returned during salvaging
        this.ingredientSalvagePercent = ingredientSalvagePercent

        // Default to 20% of Crafting Components being returned during salvaging
        this.componentSalvagePercent = componentSalvagePercent
    }
}

export class CraftingList {
    constructor(options = new CraftingOptions()) {
        this.reset(true)
        this.options = options
        this.salvage_kit = null

        getItem(SALVAGE_KIT_NAME).then(data => {
            this.salvage_kit = data
        })
    }

    reset(list = false) {
        if (list)
            this.list = {}  // Recipes
        this.components = {}    // Recipes
        this.refined = {}   // Recipes
        this.items = {} // Items
        this.cost = 0
    }

    add(recipe, quantity = 1) {
        if (!(recipe.name in this.list)) {
            this.list[recipe.name] = recipe

            // Necessary as the recipe object may already have a quantity value
            this.list[recipe.name].quantity = quantity
        } else {
            this.list[recipe.name].quantity += quantity
        }
    }

    get count() {
        return Object.keys(this.list).length
    }

    async _calculate(recipe, quantity) {
        let quantity_ = quantity

        if (this.options.salvaging && recipe.item.salvageable) {
            if (!(SALVAGE_KIT_NAME in this.list.items))
                this.salvage_kit.quantity = new Quantity(0, this.salvage_kit.stack_size)
                this.list.items[SALVAGE_KIT_NAME] = this.salvage_kit

            this.list.items[SALVAGE_KIT_NAME].quantity.total += quantity
        }

        for (let ingredientKey in recipe.ingredients) {
            let ingredient = recipe.ingredients[ingredientKey]

            // Modify the quantity needed based on salvaged materials
            if (this.options.salvaging && recipe.item.salvageable) {
                let percent = 100

                if (ingredient.item.type.name === ITEM_TYPE_COMPONENT) {
                    percent = this.options.componentSalvagePercent
                } else if (ingredient.item.type.name === ITEM_TYPE_INGREDIENT) {
                    percent = this.options.ingredientSalvagePercent
                }

                quantity_ = Math.ceil(quantity * (100 - percent) / 100)
            }

            const subRecipe = await getRecipe(ingredient.item.name)

            let currentList = null
            let key = null
            let object_ = null

            if (subRecipe) {
                await this._calculate(subRecipe, quantity_ * ingredient.quantity)

                if (subRecipe.type.name === CRAFTING_TYPE_REFINED)
                    currentList = this.refined
                else if (subRecipe.type.name === CRAFTING_TYPE_COMPONENT)
                    currentList = this.components
                else
                    throw `Invalid crafting type: "${subRecipe.type}" for a sub-recipe: "${subRecipe}"`

                key = subRecipe.name
                object_ = subRecipe
            } else {
                // Just an item, not a recipe
                currentList = this.items
                key = ingredient.item.name
                object_ = ingredient.item
            }

            // Add the sub recipe to the crafting list
            if (!(key in currentList))
                currentList[key] = object_

            object_ = currentList[key]

            if (!(object_.quantity))
                object_.quantity = new Quantity(0, object_.stack_size)

            object_.quantity.total += quantity_ * ingredient.quantity
        }

        this.cost += (recipe.cost * quantity)
    }

    async calculate() {
        this.reset()

        for (let key in this.list) {
            let object_ = this.list[key]

            await this._calculate(object_, object_.quantity)
        }
    }
}

export class Quantity {
    constructor(total, stack_size) {
        this.total = total
        this.stack_size = stack_size
    }

    get stacks() {
        return Math.trunc(this.total / this.stack_size)
    }

    get remainder() {
        return this.total - Math.trunc(this.total / this.stack_size) * this.stack_size
    }

    set stacks(value) {
        let difference = value - this.stacks
        this.total += this.stack_size * difference
    }

    set remainder(value) {
        let difference = value - this.remainder
        this.total += difference
    }

    clone() {
        return new Quantity(this.total, this.stack_size)
    }
}
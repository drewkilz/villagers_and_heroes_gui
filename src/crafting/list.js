import {getRecipe, SALVAGE_KIT} from '@/vnhApi'
import {CraftingObject} from '@/crafting/object'
import {CraftingOptions} from '@/crafting/options'
import {CraftingQuantity} from '@/crafting/quantity'
import {Cost} from '@/models/cost'
import {CraftingType, ItemType} from '@/models/type'

export class CraftingList {
    constructor(options = new CraftingOptions()) {
        this.reset(true)
        this.options = options
    }

    get count() {
        return Object.keys(this.list).length
    }

    async _calculate(recipe, quantity) {
        let quantity_ = quantity

        if (this.options.salvaging && recipe.item.salvageable) {
            if (!(SALVAGE_KIT.name in this.list.items)) {
                this.list.items[SALVAGE_KIT.name] = new CraftingObject(
                    SALVAGE_KIT.clone(), new CraftingQuantity(0, SALVAGE_KIT.stackSize))
            }

            this.list.items[SALVAGE_KIT.name].quantity.total += quantity
        }

        for (let ingredientKey in recipe.ingredients) {
            let ingredient = recipe.ingredients[ingredientKey]

            // Modify the quantity needed based on salvaged materials
            if (this.options.salvaging && recipe.item.salvageable) {
                let percent = 100

                if (ingredient.item.type.name === ItemType.COMPONENT)
                    percent = this.options.componentSalvagePercent
                else if (ingredient.item.type.name === ItemType.INGREDIENT)
                    percent = this.options.ingredientSalvagePercent

                quantity_ = Math.ceil(quantity * (100 - percent) / 100)
            }

            const subRecipe = await getRecipe(ingredient.item.name)

            let currentDictionary = null
            let key = null
            let object = null

            if (subRecipe) {
                await this._calculate(subRecipe, quantity_ * ingredient.quantity)

                if (subRecipe.type.name === CraftingType.REFINED)
                    currentDictionary = this.refined
                else if (subRecipe.type.name === CraftingType.COMPONENT)
                    currentDictionary = this.components
                else
                    throw `Invalid crafting type: "${subRecipe.type}" for a sub-recipe: "${subRecipe}"`

                key = subRecipe.name
                object = new CraftingObject(subRecipe, new CraftingQuantity(
                    quantity_ * ingredient.quantity, subRecipe.item.stackSize))
            } else {
                // Just an item, not a recipe
                currentDictionary = this.items
                key = ingredient.item.name
                object = new CraftingObject(ingredient.item,
                    new CraftingQuantity(quantity_ * ingredient.quantity, ingredient.item.stackSize))
            }

            if (!(key in currentDictionary)) {
                // Add the sub recipe / item to the dictionary
                currentDictionary[key] = object
            }
            else {
                // The sub recipe / item already exists, so update the quantity
                currentDictionary[key].quantity.total += object.quantity.total
            }

            if (!(key in this.all)) {
                // Add the sub recipe / item to the dictionary of all items / recipes for quick lookup
                this.all[key] = object
            }
            // No else required as the object will have already been updated by the currentDictionary update
        }

        this.cost.total += (recipe.cost.total * quantity)
    }

    add(recipe, quantity = 1) {
        if (!(recipe.name in this.list))
            this.list[recipe.name] = new CraftingObject(recipe, quantity)
        else
            this.list[recipe.name].quantity += quantity
    }

    async calculate() {
        this.reset()

        for (let key in this.list) {
            let object = this.list[key]

            await this._calculate(object.object, object.quantity)

            // Add the object to the dictionary of all objects for fast lookups with a better quantity object
            this.all[key] = object
            object.quantity = new CraftingQuantity(object.quantity, object.object.item.stackSize)
        }
    }

    reset(list = false) {
        if (list)
            this.list = {}
        this.all = {}
        this.components = {}
        this.items = {}
        this.refined = {}
        this.cost = new Cost(0)
    }
}

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
        let quantity_ = quantity.total

        if (this.options.salvaging && recipe.item.salvageable) {
            if (!(SALVAGE_KIT.name in this.items)) {
                this.items[SALVAGE_KIT.name] = new CraftingObject(
                    SALVAGE_KIT.clone(), new CraftingQuantity(0, SALVAGE_KIT.stackSize))

                if (!(SALVAGE_KIT.name in this.all)) {
                    // Add the salvage kit to the dictionary of all items / recipes for quick lookup
                    this.all[SALVAGE_KIT.name] = this.items[SALVAGE_KIT.name]
                }
            }

            this.items[SALVAGE_KIT.name].quantity.total += quantity.total
            this.items[SALVAGE_KIT.name].neededQuantity.total += quantity.total
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

                quantity_ = Math.ceil(quantity.total * (100 - percent) / 100)
            }

            const subRecipe = await getRecipe(ingredient.item.name)

            let currentDictionary = null
            let key = null
            let object = null

            if (subRecipe) {
                await this._calculate(subRecipe, new CraftingQuantity(
                    quantity_ * ingredient.quantity, subRecipe.item.stackSize))

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
                currentDictionary[key].neededQuantity.total += object.neededQuantity.total
            }

            if (!(key in this.all)) {
                // Add the sub recipe / item to the dictionary of all items / recipes for quick lookup
                this.all[key] = object
            }
            // No else required as the object will have already been updated by the currentDictionary update
        }

        this.cost.total += (recipe.cost.total * quantity.total)
    }

    add(recipe, quantity = 1) {
        if (!(recipe.name in this.list))
            this.list[recipe.name] = new CraftingObject(recipe, new CraftingQuantity(quantity, recipe.item.stackSize))
        else
            this.list[recipe.name].quantity.total += quantity
    }

    async calculate(calculatedRecipes) {
        this.reset()

        for (let key in this.list) {
            let object = this.list[key]

            await this._calculate(object.object, object.quantity)

            // Add the object to the dictionary of all objects for fast lookups with a better quantity object
            this.all[key] = object

            calculatedRecipes.count += 1
        }
    }

    reset(list = false) {
        if (list)
            this.list = {}
        else
            for (let key in this.list) {
                let object = this.list[key]
                // Reset the list items so that obtained quantities are set back to zero
                this.list[key] = object.clone()
            }
        this.all = {}
        this.components = {}
        this.items = {}
        this.refined = {}
        this.cost = new Cost(0)
    }
}

export class CraftingOptions {
    constructor(salvaging = false, ingredientSalvagePercent = 65, componentSalvagePercent = 20) {
        this.salvaging = salvaging

        // Default to 65% of Crafting Ingredients being returned during salvaging
        this.ingredientSalvagePercent = ingredientSalvagePercent

        // Default to 20% of Crafting Components being returned during salvaging
        this.componentSalvagePercent = componentSalvagePercent

        this.craftingCostReduction = 0
    }
}

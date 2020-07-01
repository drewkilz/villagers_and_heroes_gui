export class CraftingType {
    static COMPONENT = 'Crafting Components'
    static REFINED = 'Refined Ingredients'
}

export class ItemType {
    static COMPONENT = 'Crafting Component'
    static INGREDIENT = 'Crafting Ingredient'
    static MINERAL = 'Mineral'
    static BUG = 'Bug'
    static FISH = 'Fish'
    static PLANT = 'Plant'
    static ITEM = 'Item'
    static TOOL = 'Tool'
}

export class SkillType {
    static COOKING = 'Cooking'
    static SMITHING = 'Smithing'
    static TAILORING = 'Tailoring'
    static WOODCRAFTING = 'Woodcrafting'
    static BUG_LORE = 'Bug Lore'
    static FISHING = 'Fishing'
    static MINING = 'Mining'
    static PLANT_LORE = 'Plant Lore'
    static GARDENING = 'Gardening'
    static RANCHING = 'Ranching'
}

export class CraftingSkill {
    static COOKING = SkillType.COOKING
    static SMITHING = SkillType.SMITHING
    static TAILORING = SkillType.TAILORING
    static WOODCRAFTING = SkillType.WOODCRAFTING
}

export class GatheringSkillType {
    static BUG_LORE = SkillType.BUG_LORE
    static FISHING = SkillType.FISHING
    static MINING = SkillType.MINING
    static PLANT_LORE = SkillType.PLANT_LORE
}

export class VillageSkill {
    static GARDENING = SkillType.GARDENING
    static RANCHING = SkillType.RANCHING
}

export class Rarity {
    static COMMON = 'Common'
    static UNCOMMON = 'Uncommon'
    static RARE = 'Rare'
    static EPIC = 'Epic'
    static LEGENDARY = 'Legendary'
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

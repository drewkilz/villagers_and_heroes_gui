export class CraftingType {
    static SWORD = 'Warrior Swords'
    static STAFF = 'Wizard Staffs'
    static MACE = 'Priest Maces'
    static BOW = 'Hunter Bows'
    static AXE = 'Shaman Axes'

    static ARMOR = 'Armor and Outfits'
    static BELT = 'Belts'
    static GLOVE = 'Gloves'
    static BOOTS = 'Boots and Shoes'
    static HATS = 'Hats and Helms'
    static SHIELD = 'Priest, Shaman, and Warrior Shields'

    static TRINKET = 'Carved Trinkets'

    static REFINED = 'Refined Ingredients'
    static TOOL = 'Crafting Tools'
    static SPECIAL = 'Special Recipes'
    static COMPONENT = 'Crafting Components'
    static NECKLACE = "Crafter's Necklaces"

    static POWDER = 'Metal Powder and Mineral Oil'
    static EMBROIDERY = 'Cloth Embroidery and Leather Stitching'
    static RESIN = 'Wood Resins and Pitch'

    static FOOD = 'Cooked Food and Baked Goods'
    static HEALTH = 'Health Potions'
    static MANA = 'Mana Potions'
    static DRAM = 'Drams'
    static TRIAD = 'Triad Potions'
}

export class ItemType {
    static MINERAL = 'Mineral'
    static INGREDIENT = 'Crafting Ingredient'
    static COMPONENT = 'Crafting Component'
    static BUG = 'Bug'
    static FISH = 'Fish'
    static PLANT = 'Plant'
    static ITEM = 'Item'
    static PREPARATION = 'Preparation'
    static SWORD = 'Sword'
    static STAFF = 'Staff'
    static MACE = 'Mace'
    static BOW = 'Bow'
    static AXE = 'Axe'
    static HEADWEAR = 'Headwear'
    static SHIELD = 'Shield'
    static NECKLACE = 'Necklace'
    static BELT = 'Belt'
    static RING = 'Ring'
    static TRINKET = 'Trinket'
    static TOTEM = 'Totem'
    static BOOTS = 'Boots'
    static GLOVE = 'Glove'
    static ARMOR = 'Armor'
    static TOOL = 'Tool'
    static CONSUMABLE = 'Consumable'
    static HARVEST = 'Harvest'
    static QUEST = 'Quest Item'
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

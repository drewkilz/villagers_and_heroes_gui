import {Recipe} from "@/models/recipe";
import {SALVAGE_KIT_NAME, WATER_NAME} from "@/models/item";
import {CraftingType, GatheringSkillType, ItemType} from "@/models/type";
import {getWikiLink} from "@/utility";

let ranchingAnimalHarvestLevelMap = {
    1: {min: 1, max: 9},
    15: {min: 10, max: 19},
    30: {min: 20, max: 29},
    45: {min: 30, max: 34},
    60: {min: 35, max: 39},
    75: {min: 40, max: 44},
    90: {min: 45, max: 49}
}

export function getSource(object) {
    let source = {
        link: null,
        text: null
    }

    if (object instanceof Recipe) {
        source.text = `${object.skill.name} (${object.level})`

        if (!(object.type.name === CraftingType.COMPONENT || object.type.name === CraftingType.REFINED)) {
            // Add the type if not component or refined (so, effectively just the final products)
            source.text += `: ${object.type.name}`
        }


        if (object.type.name.endsWith('Leather'))
            source.text += `, Beasts (${getSourceLevelRangeText(object.level)})`
    } else if (object.name === SALVAGE_KIT_NAME) {
        source.link = getWikiLink('Littia Remus')
        source.text = 'Littia Remus (Ardent City:D3)'
    } else if (object.name === WATER_NAME) {
        source.link = getWikiLink('Water Well')
        source.text = 'Water Well'
    } else if (object.type.name === ItemType.PLANT)
        source.text = getSourceGatheringText(GatheringSkillType.PLANT_LORE, object.level)
    else if (object.type.name === ItemType.BUG)
        source.text = getSourceGatheringText(GatheringSkillType.BUG_LORE, object.level)
    else if (object.type.name === ItemType.MINERAL)
        source.text = getSourceGatheringText(GatheringSkillType.MINING, object.level)
    else if (object.type.name === ItemType.FISH)
        source.text = getSourceGatheringText(GatheringSkillType.FISHING, object.level)
    else if (object.type.name === ItemType.HARVEST)
        source.text = `Gardening (${object.level})`
    else if (object.name.endsWith('Pelt'))
        source.text = `Ranching: Boars (${getSourceLevelRangeRanchingText(object.level)}), Beasts (${getSourceLevelRangeText(object.level)})`
    else if (object.type.name.endsWith(ItemType.TOOL)) {
        source.link = getWikiLink('Tool Vendor')
        source.text = 'Tool Vendor'
    } else if (object.type.name === ItemType.INGREDIENT || object.type.name === ItemType.COMPONENT) {
        // TODO: Better text needed for "Mote of XXX", "Primal XXX", "Earthentine", "Living Fossil", etc.
        source.text = `Beasts (${object.level})`
    }

    if (!source.text)
        source.text = 'Unknown'

    return source
}

export function getSourceGatheringText(skill, level) {
    return `${skill} (${getSourceLevelRangeText(level)})`
}

export function getSourceLevelRangeText(level, range = 14) {
    let max = level + range
    if (max > 95)
        max = 95

    return `${level}-${max}`
}

export function getSourceLevelRangeRanchingText(level) {
    let levelRange = ranchingAnimalHarvestLevelMap[level]

    return getSourceLevelRangeText(levelRange.min, levelRange.max - levelRange.min)
}

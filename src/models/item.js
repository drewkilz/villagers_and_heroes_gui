import { Type } from '@/models/type'

export const SALVAGE_KIT_NAME = 'Salvage Kit'

export class Item {
    constructor() {
        this.id = null
        this.name = null

        this.class = null
        this.level = null
        this.rarity = null
        this.salvageable = null
        this.stackSize = null
        this.subclass = null
        this.type = null
    }

    clone() {
        let item = new Item()

        item.id = this.id
        item.name = this.name

        item.class = this.class ? this.class.clone() : this.class
        item.level = this.level
        item.rarity = this.rarity ? this.rarity.clone() : this.rarity
        item.salvageable = this.salvageable
        item.stackSize = this.stackSize
        item.subclass = this.subclass ? this.subclass.clone() : this.subclass
        item.type = this.type ? this.type.clone() : this.type

        return item
    }

    static fromJson(json) {
        if (!json)
            return null

        let item = new Item()

        item.id = json.id
        item.name = json.name

        item.class = Type.fromJson(json.class_)
        item.level = json.level
        item.rarity = Type.fromJson(json.rarity)
        item.salvageable = json.salvageable
        item.stackSize = json.stack_size
        item.subclass = Type.fromJson(json.subclass)
        item.type = Type.fromJson(json.type)

        return item
    }
}

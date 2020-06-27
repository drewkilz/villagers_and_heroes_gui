import { CraftingQuantity } from '@/crafting/quantity'
import { Recipe } from '@/models/recipe'

export class CraftingObject {
    constructor(object, quantity) {
        this.object = object
        this.quantity = quantity

        if (quantity instanceof CraftingQuantity) {
            this.neededQuantity = quantity.clone()
            this.obtainedQuantity = quantity.clone()
        }
        else {
            this.neededQuantity = new CraftingQuantity(quantity,
                object instanceof Recipe ? object.item.stackSize : object.stackSize)
            this.obtainedQuantity = new CraftingQuantity(quantity,
                object instanceof Recipe ? object.item.stackSize : object.stackSize)
        }

        this.obtainedQuantity.total = 0
    }

    clone() {
        return new CraftingObject(this.object.clone(), this.quantity instanceof CraftingQuantity ?
            this.quantity.clone() : this.quantity)
    }
}
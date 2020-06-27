import { Cost } from '@/models/cost'
import { Ingredient } from '@/models/ingredient'
import { Item } from '@/models/item'
import { Type } from '@/models/type'

export class Recipe {
    constructor() {
        this.id = null
        this.name = null

        this.cost = null
        this.ingredients = []
        this.item = null
        this.level = null
        this.skill = null
        this.type = null
    }

    clone() {
        let recipe = new Recipe()

        recipe.id = this.id
        recipe.name = this.name

        recipe.cost = this.cost ? this.cost.clone() : this.cost
        recipe.ingredients = []
        recipe.item = this.item ? this.item.clone() : this.item
        recipe.level = this.level
        recipe.skill = this.skill ? this.skill.clone() : this.skill
        recipe.type = this.type ? this.type.clone() : this.type

        if (this.ingredients) {
            for (let index in this.ingredients) {
                recipe.ingredients.push(this.ingredients[index] ?
                    this.ingredients[index].clone() : this.ingredients[index])
            }
        }

        return recipe
    }

    static fromJson(json) {
        if (json === null)
            return null

        let recipe = new Recipe()

        recipe.id = json.id
        recipe.name = json.name

        recipe.cost = new Cost(json.cost)
        recipe.ingredients = []
        recipe.item = Item.fromJson(json.item)
        recipe.level = json.level
        recipe.skill = Type.fromJson(json.skill)
        recipe.type = Type.fromJson(json.type)

        if (json.ingredients) {
            for (let index in json.ingredients) {
                recipe.ingredients.push(Ingredient.fromJson(json.ingredients[index]))
            }
        }

        return recipe
    }
}

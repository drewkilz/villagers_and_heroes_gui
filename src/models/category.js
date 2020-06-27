import { Type } from '@/models/type'

export class Category {
    constructor() {
        this.id = null
        this.name = null

        this.types = []
    }

    clone() {
        let category = new Category()

        category.id = this.id
        category.name = this.name

        category.types = []

        if (this.types) {
            for (let index in this.types) {
                category.types.push(this.types[index] ? this.types[index].clone() : this.types[index])
            }
        }

        return category
    }

    static fromJson(json) {
        if (!json)
            return null

        let category = new Category()

        category.id = json.id
        category.name = json.name

        category.types = []

        if (json.types) {
            for (let index in json.types) {
                category.types.push(Type.fromJson(json.types[index]))
            }
        }

        return category
    }
}

export class EquipmentOptions {
    constructor(level = 1, numLevels = 5, heroClasses = [], heroSubClasses = [],
                villagerClasses = []) {
        this.level = level
        this.numLevels = numLevels
        this.heroClasses = heroClasses
        this.heroSubClasses = heroSubClasses
        this.villagerClasses = villagerClasses
    }
}

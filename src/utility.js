export function compareValues(key, order = 'asc') {
    let keys = key.split('.')

    // eslint-disable-next-line no-unused-vars
    return (a, b) => {
        let evalExpression = ''
        for (let index in keys) {
            evalExpression += `['${keys[index]}']`
        }
        let aValue = null
        let bValue = null
        try {
            aValue = eval(`a${evalExpression}`)
            bValue = eval(`b${evalExpression}`)
            if (!aValue || !bValue) {
                // Keys don't exist on one or both of the objects so can't compare (or they are both nothing)
                return 0
            }
        }
        catch {
            // Sub-keys don't exist on one or both of the objects so can't compare
            return 0
        }

        const varA = (typeof aValue === 'string') ? aValue.toUpperCase() : aValue
        const varB = (typeof bValue === 'string') ? bValue.toUpperCase() : bValue

        let comparison = 0
        if (varA > varB) {
            comparison = 1
        } else if (varA < varB) {
            comparison = -1
        }
        return (
            (order === 'desc') ? (comparison * -1) : comparison
        )
    }
}

export function getWikiLink(page) {
    return `https://villagersandheroes.gamepedia.com/${encodeURI(page.replace(/ /g, '_'))}`
}

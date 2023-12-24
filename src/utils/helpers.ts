export function extractUniqueTypes<T>(arr: T[], ppty: keyof T): Array<T[keyof T]> {
    const uniqueTypes: Array<T[keyof T]> = []

    arr.forEach((obj) => {
        const value = obj[ppty]

        if(!uniqueTypes.includes(value)) {
            uniqueTypes.push(value)
        }
    })

    return uniqueTypes;
}
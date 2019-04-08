const shallowCopy = (obj) => ({ ...obj });

const arrayToDb = (arr, identifier = 'id', mapFn = shallowCopy) => {
    const getKey = getUniqueKeyBuilder(identifier);

    return arr.reduce((table, item, index, context) => {
        const key = getKey(item);
        if (!table.hasOwnProperty(key)) {
            table[key] = mapFn(item, index, context);
        } else {
            console.warn(`arrayToDb: Duplicate key: "${key}"`);
        }
        return table;
    }, {});
};

const getUniqueKeyBuilder = (idProp, separator = '') => (item) => {
    if (Array.isArray(idProp)) {
        return idProp.map(prop => item[prop]).join(separator);
    } else if (typeof idProp === 'function') {
        return idProp(item);
    }
    return `${item[idProp]}`;
};

/**
 * Transform an array of identifiable objects to a flat object, identifying each object with a unique
 * `idProp`. The objects can be retrieved by using their unique identifier as key.
 *
 * By using the unique identifier, you get a lookup of O(1). Mapping over the entire collection is
 * done by either `Object.keys()`, `Object.values()`, `Object.entries()`, or with a `for-of` loop.
 *
 * Example:
 * ```
import arrayToDb from '@remypar/array-to-db';
const heroes = [
 { id: 'luke', name: 'Luke Skywalker' },
 { id: 'leia', name: 'Princess Leia Organa of Alderaan' },
];
const heroesDb = arrayToDb(heroes);
console.log(heroesDb) // -> {
 luke: { id: 'luke', name: 'Luke Skywalker', order: 0 },
 leia: { id: 'leia', name: 'Princess Leia Organa of Alderaan', order: 1 },
}
```
 *
 * @param {object[]} arr the array of objects to map to a database
 * @param {string|string[]|function} idProp the unique identification property name. `DEFAULT: id`
 * @param {function}
 */

export default arrayToDb;
export {
    arrayToDb,
    getUniqueKeyBuilder,
};

const arrayToTable = (arr, idProp = 'id') => {
    const table = {};
    const createUniqueKey = getUniqueKeyBuilder(idProp);

    arr.forEach((item) => {
        const key = createUniqueKey(item);

        if (! table.hasOwnProperty(key)) {
            table[key] = item;
        } else {
            console.warn(`arrayToTable: Duplicate key: "${key}"`);
        }
    });

    return table;
};

const getUniqueKeyBuilder = (idProp) => (item) => {
    if (Array.isArray(idProp)) {
        return idProp.map(prop => item[prop]).join('|');
    } else if (typeof idProp === 'function') {
        return idProp(item);
    }
    return `${item[idProp]}`;
};

export default arrayToTable;
export {
    arrayToTable,
    getUniqueKeyBuilder,
};

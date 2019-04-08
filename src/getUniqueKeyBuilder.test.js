import { getUniqueKeyBuilder } from './arrayToDb';

describe('getUniqueKeyBuilder()', () => {
    let item;

    beforeEach(() => {
        item = {
            id: 'unique',
            name: 'name 1',
        };
    });

    it('accepts a string as `idProp`', () => {
        const identifier = 'id';
        const getKey = getUniqueKeyBuilder(identifier);
        const key = getKey(item);

        expect(key).toBe('unique');
    });

    it('accepts an array of property names as `idProp`', () => {
        const identifier = ['id', 'name'];
        const getKey = getUniqueKeyBuilder(identifier);
        const key = getKey(item);

        expect(key).toBe('uniquename 1');
    });

    it('accepts a separator next to an array of property names as `idProp`', () => {
        const identifier = ['id', 'name'];
        const separator = '|';
        const getKey = getUniqueKeyBuilder(identifier, separator);
        const key = getKey(item);

        expect(key).toBe('unique|name 1');
    });

    it('accepts a function as `idProp`', () => {
        const identifier = (item) => item.id;
        const getKey = getUniqueKeyBuilder(identifier);
        const key = getKey(item);

        expect(key).toBe('unique');
    });
});

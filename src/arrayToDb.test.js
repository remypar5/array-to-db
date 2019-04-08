import arrayToDb from './arrayToDb';

describe('arrayToDb()', () => {
    let originArray;

    beforeEach(() => {
        originArray = [{
            id: 'id1',
            name: 'name1',
        }, {
            id: 'id2',
            name: 'name2',
        }, {
            id: 'id3',
            name: 'name3',
        }];
    });

    describe('standard behaviour', () => {
        it('should create a table out of the input array', () => {
            const table = arrayToDb(originArray);
            const expectation = {
                'id1': { id: 'id1', name: 'name1' },
                'id2': { id: 'id2', name: 'name2' },
                'id3': { id: 'id3', name: 'name3' },
            };

            expect(table).toEqual(expectation, 'string (default)');
        });

        it('should not change the input array (be immutable)', () => {
            const table = arrayToDb(originArray);

            originArray.forEach((item) => {
                expect(item).toEqual(table[item.id]); // It should look to same...
                expect(item).not.toBe(table[item.id]); // ...but not BE the same
            });
        });
    });

    describe('identification', () => {
        it('should accept a property name to use as unique identifier', () => {
            const table = arrayToDb(originArray, 'name');
            const expectation = {
                'name1': { id: 'id1', name: 'name1' },
                'name2': { id: 'id2', name: 'name2' },
                'name3': { id: 'id3', name: 'name3' },
            };

            expect(table).toEqual(expectation, 'string ("name")');
        });

        it('accepts an array of property names to use as unique identifier', () => {
            const table1 = arrayToDb(originArray, ['id', 'name']);
            const expectation1 = {
                'id1name1': { id: 'id1', name: 'name1' },
                'id2name2': { id: 'id2', name: 'name2' },
                'id3name3': { id: 'id3', name: 'name3' },
            };

            expect(table1).toEqual(expectation1, 'array [id, name]');

            const table2 = arrayToDb(originArray, ['name', 'id']);
            const expectation2 = {
                'name1id1': { id: 'id1', name: 'name1' },
                'name2id2': { id: 'id2', name: 'name2' },
                'name3id3': { id: 'id3', name: 'name3' },
            };
            expect(table2).toEqual(expectation2, 'array [name, id]');
        });

        it('accepts a function to generate the unique identifier', () => {
            const identifier = item => `prefix_${item.id}`;
            const table = arrayToDb(originArray, identifier);
            const expectation = {
                'prefix_id1': { id: 'id1', name: 'name1' },
                'prefix_id2': { id: 'id2', name: 'name2' },
                'prefix_id3': { id: 'id3', name: 'name3' },
            };

            expect(table).toEqual(expectation, 'function');
        });
    });

    describe('object mapping', () => {
        it('should create a shallow copy of each object by default', () => {
            const fancyPropertyNames = (item) => ({
                singularity: item.id,
                monniker: item.name,
            });
            const table = arrayToDb(originArray, undefined, fancyPropertyNames);
            const expectation = {
                'id1': { singularity: 'id1', monniker: 'name1' },
                'id2': { singularity: 'id2', monniker: 'name2' },
                'id3': { singularity: 'id3', monniker: 'name3' },
            };

            expect(table).toEqual(expectation);
        });
    });

    describe('duplicates', () => {
        const consoleSpy = jest.spyOn(console, 'warn');

        beforeEach(() => {
            originArray = [
                { id: 'duplicate', name: 'name1' },
                { id: 'duplicate', name: 'name2' },
                { id: 'unique', name: 'name3' },
            ];
            consoleSpy.mockReset();
        });

        it('should warn about duplicates', () => {
            arrayToDb(originArray);

            expect(consoleSpy).toHaveBeenCalledWith('arrayToDb: Duplicate key: "duplicate"');
        });

        it('should not add objects with a non-unique identifier if there is one already', () => {
            const table = arrayToDb(originArray);
            const expectation = {
                'duplicate': { id: 'duplicate', name: 'name1' },
                'unique': { id: 'unique', name: 'name3' },
            };

            expect(table).toEqual(expectation);
        });
    });
});

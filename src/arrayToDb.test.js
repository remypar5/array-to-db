import arrayToDb from './arrayToDb';

describe('arrayToDb', () => {
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

    it('should create a table out of the input array', () => {
        const table = arrayToDb(originArray);
        const expectation = {
            'id1': { id: 'id1', name: 'name1' },
            'id2': { id: 'id2', name: 'name2' },
            'id3': { id: 'id3', name: 'name3' },
        };

        expect(table).toEqual(expectation, 'string (default)');
    });

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
            'id1|name1': { id: 'id1', name: 'name1' },
            'id2|name2': { id: 'id2', name: 'name2' },
            'id3|name3': { id: 'id3', name: 'name3' },
        };

        expect(table1).toEqual(expectation1, 'array [id, name]');

        const table2 = arrayToDb(originArray, ['name', 'id']);
        const expectation2 = {
            'name1|id1': { id: 'id1', name: 'name1' },
            'name2|id2': { id: 'id2', name: 'name2' },
            'name3|id3': { id: 'id3', name: 'name3' },
        };
        expect(table2).toEqual(expectation2, 'array [name, id]');
    });

    it('accepts a function to generate the unique identifier', () => {
        const identifier = item => `prefix_${item.id}`;
        const table1 = arrayToDb(originArray, identifier);
        const expectation1 = {
            'prefix_id1': { id: 'id1', name: 'name1' },
            'prefix_id2': { id: 'id2', name: 'name2' },
            'prefix_id3': { id: 'id3', name: 'name3' },
        };

        expect(table1).toEqual(expectation1, 'function');
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
            const table = arrayToDb(originArray);
            const expectation = {
                'duplicate': { id: 'duplicate', name: 'name1' },
                'unique': { id: 'unique', name: 'name3' },
            };

            expect(table).toEqual(expectation);
            expect(consoleSpy).toHaveBeenCalledWith('arrayToDb: Duplicate key: "duplicate"');
        });
    });
});

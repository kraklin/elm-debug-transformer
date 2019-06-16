import { expect } from 'chai';
import * as _ from 'lodash';
import { ElmDebugValue } from '../src/CommonTypes';
import SimpleFormatter from '../src/formatters/SimpleFormatter';

function elmDebug(values): ElmDebugValue {
    return { type: 'ElmDebug', name: 'Debug', value: values };
}

function list(values: any[]): ElmDebugValue {
    return { type: 'List', value: values };
}

function record(values: object) {
    return { type: 'Record', value: values };
}

function n(number: number) {
    return { type: 'Number', value: number };
}

function customType(name: String, values: any[]) {
    return { type: 'Custom', name: name, value: values };
}

function type(name) {
    return { type: 'Type', name: name };
}

function dict(dict: object) {
    return {
        type: 'Dict',
        value: _.toPairs(dict).map(item => {
            return { key: item[0], value: item[1] };
        }),
    };
}

let formatter;

beforeEach(() => {
    formatter = new SimpleFormatter();
});

describe('Simple formatting', () => {
    describe('should return values for simple values', () => {
        it('string', () => {
            expect(formatter.format(elmDebug('string'))).to.deep.equal({
                Debug: 'string',
            });
        });

        it('int', () => {
            expect(formatter.format(elmDebug(123))).to.deep.equal({
                Debug: 123,
            });
        });

        it('bool', () => {
            expect(formatter.format(elmDebug(false))).to.deep.equal({
                Debug: false,
            });
        });
    });

    describe('should return values for lists', () => {
        it('empty list', () => {
            expect(
                formatter.format(
                    elmDebug(
                        record({
                            list: list([]),
                        })
                    )
                )
            ).to.deep.equal({ Debug: { list: [] } });
        });

        it('numbers list', () => {
            expect(
                formatter.format(
                    elmDebug(
                        record({
                            list: list([n(1), n(2), n(3)]),
                        })
                    )
                )
            ).to.deep.equal({ Debug: { list: [1, 2, 3] } });
        });
    });

    describe('should return values for custom types', () => {
        it('Simple type', () => {
            expect(
                formatter.format(
                    elmDebug(
                        record({
                            list: list([]),
                        })
                    )
                )
            ).to.deep.equal({ Debug: { list: [] } });
        });

        it('list of Maybe types', () => {
            expect(
                formatter.format(
                    elmDebug(
                        record({
                            list: list([
                                type('Nothing'),
                                customType('Just', [list(['String'])]),
                                type('Nothing'),
                                type('Nothing'),
                            ]),
                        })
                    )
                )
            ).to.deep.equal({
                Debug: {
                    list: [
                        'Nothing',
                        { Just: ['String'] },
                        'Nothing',
                        'Nothing',
                    ],
                },
            });
        });

        it('Custom with just one value', () => {
            expect(
                formatter.format(elmDebug(customType('Just', ['String'])))
            ).to.deep.equal({ Debug: { Just: 'String' } });
        });

        it('Nested custom', () => {
            expect(
                formatter.format(
                    elmDebug(
                        customType('Just', [
                            customType('Node', [
                                customType('Leaf', [1]),
                                customType('Leaf', [2]),
                            ]),
                        ])
                    )
                )
            ).to.deep.equal({
                Debug: { Just: { Node: [{ Leaf: 1 }, { Leaf: 2 }] } },
            });
        });
    });

    describe('should return values for records', () => {
        it('simple record', () => {
            expect(
                formatter.format(elmDebug(record({ name: 'Name', age: 12 })))
            ).to.deep.equal({ Debug: { name: 'Name', age: 12 } });
        });
    });

    describe('should return values for dictionaries', () => {
        it('handles simple record', () => {
            let value = elmDebug(dict({ name: 'Name', age: '12' }));

            expect(formatter.format(value)).to.deep.equal({
                Debug: {
                    name: 'Name',
                    age: '12',
                },
            });
        });
    });

    describe('should return values for internals', () => {
        it('Function', () => {
            let value = elmDebug({ type: 'Function' });

            expect(formatter.format(value)).to.deep.equal({
                Debug: '<function>',
            });
        });

        it('Internals', () => {
            let value = elmDebug({ type: 'Internals' });

            expect(formatter.format(value)).to.deep.equal({
                Debug: '<internals>',
            });
        });
    });

    describe('should return values for bytes and files', () => {
        it('Bytes', () => {
            let value = elmDebug({ type: 'Bytes', value: 1234 });

            expect(formatter.format(value)).to.deep.equal({ Debug: '1234 B' });
        });

        it('Files', () => {
            let value = elmDebug({ type: 'File', value: 'Name-of_the.file' });

            expect(formatter.format(value)).to.deep.equal({
                Debug: 'Name-of_the.file',
            });
        });
    });
});

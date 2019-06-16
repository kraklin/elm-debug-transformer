import { expect } from 'chai';
import * as _ from 'lodash';
import { ElmDebug, ElmDebugValue } from '../src/CommonTypes';
import SimpleFormatter from '../src/formatters/SimpleFormatter';

function elmDebug(values): ElmDebug {
    return { tag: 'Elm Debug', value: values };
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
            expect(formatter.format({ tag: 'str', value: 'string' })).to.equal(
                'string'
            );
        });

        it('int', () => {
            expect(formatter.format({ tag: 'int', value: 123 })).to.equal(123);
        });

        it('bool', () => {
            expect(formatter.format({ tag: 'int', value: false })).to.equal(
                false
            );
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
            ).to.deep.equal({ list: [] });
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
            ).to.deep.equal({ list: [1, 2, 3] });
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
            ).to.deep.equal({ list: [] });
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
                list: ['Nothing', { Just: ['String'] }, 'Nothing', 'Nothing'],
            });
        });

        it('Custom with just one value', () => {
            expect(
                formatter.format(elmDebug(customType('Just', ['String'])))
            ).to.deep.equal({ Just: 'String' });
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
            ).to.deep.equal({ Just: { Node: [{ Leaf: 1 }, { Leaf: 2 }] } });
        });
    });

    describe('should return values for records', () => {
        it('simple record', () => {
            expect(
                formatter.format(elmDebug(record({ name: 'Name', age: 12 })))
            ).to.deep.equal({ name: 'Name', age: 12 });
        });
    });

    describe('should return values for dictionaries', () => {
        it('handles simple record', () => {
            let value = elmDebug(dict({ name: 'Name', age: '12' }));

            expect(formatter.format(value)).to.deep.equal({
                name: 'Name',
                age: '12',
            });
        });
    });

    describe('should return values for internals', () => {
        it('handles simple record', () => {
            let value = elmDebug({ type: 'Function' });

            expect(formatter.format(value)).to.deep.equal('<function>');
        });
    });
});

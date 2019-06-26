import { expect } from 'chai';
import { IFormatter } from '../src/CommonTypes';
import SimpleFormatter from '../src/formatters/SimpleFormatter';
import * as B from './builders';

let formatter: IFormatter;

beforeEach(() => {
    formatter = new SimpleFormatter();
});

describe('Simple formatting', () => {
    describe('should return values for simple values', () => {
        it('string', () => {
            expect(formatter.format(B.elmDebug(B.str('string')))).to.deep.equal(
                {
                    Debug: 'string',
                }
            );
        });

        it('int', () => {
            expect(formatter.format(B.elmDebug(B.n(123)))).to.deep.equal({
                Debug: 123,
            });
        });

        it('bool', () => {
            expect(formatter.format(B.elmDebug(B.bool(false)))).to.deep.equal({
                Debug: false,
            });
        });
        it('unit', () => {
            expect(
                formatter.format(B.elmDebug({ type: 'Unit' }))
            ).to.deep.equal({
                Debug: '()',
            });
        });
    });

    describe('should return values for lists', () => {
        it('empty list', () => {
            expect(
                formatter.format(
                    B.elmDebug(
                        B.record({
                            list: B.list([]),
                        })
                    )
                )
            ).to.deep.equal({ Debug: { list: [] } });
        });

        it('numbers list', () => {
            expect(
                formatter.format(
                    B.elmDebug(
                        B.record({
                            list: B.list([B.n(1), B.n(2), B.n(3)]),
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
                    B.elmDebug(
                        B.record({
                            list: B.list([]),
                        })
                    )
                )
            ).to.deep.equal({ Debug: { list: [] } });
        });

        it('list of Maybe types', () => {
            expect(
                formatter.format(
                    B.elmDebug(
                        B.record({
                            list: B.list([
                                B.type('Nothing'),
                                B.customType('Just', [
                                    B.list([B.str('String')]),
                                ]),
                                B.type('Nothing'),
                                B.type('Nothing'),
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
                formatter.format(
                    B.elmDebug(B.customType('Just', [B.str('String')]))
                )
            ).to.deep.equal({ Debug: { Just: 'String' } });
        });

        it('Nested custom', () => {
            expect(
                formatter.format(
                    B.elmDebug(
                        B.customType('Just', [
                            B.customType('Node', [
                                B.customType('Leaf', [B.n(1)]),
                                B.customType('Leaf', [B.n(2)]),
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
                formatter.format(
                    B.elmDebug(B.record({ name: B.str('Name'), age: B.n(12) }))
                )
            ).to.deep.equal({ Debug: { name: 'Name', age: 12 } });
        });
    });

    describe('should return values for dictionaries', () => {
        it('handles simple record', () => {
            const value = B.elmDebug(
                B.dict({ name: B.str('Name'), age: B.str('12') })
            );

            expect(formatter.format(value)).to.deep.equal({
                Debug: {
                    age: '12',
                    name: 'Name',
                },
            });
        });
    });

    describe('should return values for internals', () => {
        it('Function', () => {
            const value = B.elmDebug({ type: 'Function' });

            expect(formatter.format(value)).to.deep.equal({
                Debug: '<function>',
            });
        });

        it('Internals', () => {
            const value = B.elmDebug({ type: 'Internals' });

            expect(formatter.format(value)).to.deep.equal({
                Debug: '<internals>',
            });
        });
    });

    describe('should return values for bytes and files', () => {
        it('Bytes', () => {
            const value = B.elmDebug({ type: 'Bytes', value: 1234 });

            expect(formatter.format(value)).to.deep.equal({ Debug: '1234 B' });
        });

        it('Files', () => {
            const value = B.elmDebug({
                type: 'File',
                value: 'Name-of_the.file',
            });

            expect(formatter.format(value)).to.deep.equal({
                Debug: 'Name-of_the.file',
            });
        });
    });
});

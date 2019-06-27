import { expect } from 'chai';
import { IJsonMLFormatter } from '../src/CommonTypes';
import JsonMLFormatter from '../src/formatters/JsonMLFormatter';
import * as B from './builders';

let formatter: IJsonMLFormatter;

beforeEach(() => {
    formatter = new JsonMLFormatter();
});

describe('JSONML formatting', () => {
    describe('Header values', () => {
        describe('should return values for simple values', () => {
            it('string', () => {
                const value = B.str('string');
                const expected = [B.MLString('string')];

                expect(
                    formatter.handleHeader(B.elmDebug(value)).toJSONML()
                ).to.deep.equal(B.MLDebug(expected));
            });

            it('number', () => {
                const value = B.n(1);
                const expected = [B.MLNumber(1)];

                expect(
                    formatter.handleHeader(B.elmDebug(value)).toJSONML()
                ).to.deep.equal(B.MLDebug(expected));
            });

            it('boolean True', () => {
                const value = B.bool(true);
                const expected = [B.MLBool(true)];

                expect(
                    formatter.handleHeader(B.elmDebug(value)).toJSONML()
                ).to.deep.equal(B.MLDebug(expected));
            });

            it('boolean False', () => {
                const value = B.bool(false);
                const expected = [B.MLBool(false)];

                expect(
                    formatter.handleHeader(B.elmDebug(value)).toJSONML()
                ).to.deep.equal(B.MLDebug(expected));
            });
        });
        describe('should return values for array like structures', () => {
            it('Empty list', () => {
                const value = B.list([], 'List');
                const expected = [B.MLList('List', 0)];

                expect(
                    formatter.handleHeader(B.elmDebug(value)).toJSONML()
                ).to.deep.equal(B.MLDebug(expected));
            });

            it('Array with one value', () => {
                const value = B.list([B.n(1)], 'Array');
                const expected = [B.MLList('Array', 1)];

                expect(
                    formatter.handleHeader(B.elmDebug(value)).toJSONML()
                ).to.deep.equal(B.MLDebug(expected));
            });

            it('Set with more values', () => {
                const value = B.list(['a', 'b', 'c'], 'Set');
                const expected = [B.MLList('Set', 3)];

                expect(
                    formatter.handleHeader(B.elmDebug(value)).toJSONML()
                ).to.deep.equal(B.MLDebug(expected));
            });

            it('Tuple with three values', () => {
                const value = B.tuple([B.str('a'), B.str('b'), B.str('c')]);
                const expected = [
                    B.MLTuple([
                        B.MLString('a'),
                        B.MLString('b'),
                        B.MLString('c'),
                    ]),
                ];

                expect(
                    formatter.handleHeader(B.elmDebug(value)).toJSONML()
                ).to.deep.equal(B.MLDebug(expected));
            });
        });
        describe('should handle Types and Custom types', () => {
            it('Type', () => {
                const value = B.type('Nothing');
                const expected = [B.MLCustomType('Nothing')];

                expect(
                    formatter.handleHeader(B.elmDebug(value)).toJSONML()
                ).to.deep.equal(B.MLDebug(expected));
            });
            it('CustomType without values', () => {
                const value = B.customType('CustomType', []);
                const expected = [B.MLCustomType('CustomType')];

                expect(
                    formatter.handleHeader(B.elmDebug(value)).toJSONML()
                ).to.deep.equal(B.MLDebug(expected));
            });
            it('CustomType with one value', () => {
                const value = B.customType('CustomType', [B.n(1)]);
                const expected = [B.MLCustomType('CustomType', B.MLNumber(1))];

                expect(
                    formatter.handleHeader(B.elmDebug(value)).toJSONML()
                ).to.deep.equal(B.MLDebug(expected));
            });
            it('CustomType with two values', () => {
                const value = B.customType('CustomType', [B.n(1), B.n(1)]);
                const expected = [B.MLCustomType('CustomType', B.MLEllipsis())];

                expect(
                    formatter.handleHeader(B.elmDebug(value)).toJSONML()
                ).to.deep.equal(B.MLDebug(expected));
            });
        });
        describe('should handle Records', () => {
            it('simple record', () => {
                const value = B.record({ name: B.str('Name') });
                const expected = [
                    B.MLRecord([B.MLRecordValue('name', B.MLString('Name'))]),
                ];

                expect(
                    formatter.handleHeader(B.elmDebug(value)).toJSONML()
                ).to.deep.equal(B.MLDebug(expected));
            });
            it('record with two values', () => {
                const value = B.record({ name: B.str('Name'), age: B.n(12) });
                const expected = [
                    B.MLRecord([
                        B.MLRecordValue('name', B.MLString('Name')),
                        B.MLRecordValue('age', B.MLNumber(12)),
                    ]),
                ];

                expect(
                    formatter.handleHeader(B.elmDebug(value)).toJSONML()
                ).to.deep.equal(B.MLDebug(expected));
            });
            it('record with long child content should be truncated to 50 chars', () => {
                const value = B.record({
                    name: B.str('Name'),
                    string: B.str(
                        'Some really long string to simulate long content for the record'
                    ),
                });
                const expected = [
                    B.MLRecord([
                        B.MLRecordValue('name', B.MLString('Name')),
                        B.MLEllipsis(),
                    ]),
                ];

                expect(
                    formatter.handleHeader(B.elmDebug(value)).toJSONML()
                ).to.deep.equal(B.MLDebug(expected));
            });
            it('record with long child content continued with short child content shoul not show the short one', () => {
                const value = B.record({
                    a: B.str('a'),
                    b: B.str(
                        'Some really long string to simulate long content for the record'
                    ),
                    c: B.str('c'),
                });
                const expected = [
                    B.MLRecord([
                        B.MLRecordValue('a', B.MLString('a')),
                        B.MLEllipsis(),
                    ]),
                ];

                expect(
                    formatter.handleHeader(B.elmDebug(value)).toJSONML()
                ).to.deep.equal(B.MLDebug(expected));
            });
        });

        describe('should return values for Dict', () => {
            it('Empty dict', () => {
                const value = B.dict({});
                const expected = [
                    [
                        'span',
                        { style: 'color: grey; font-weight: normal;' },
                        'Dict.empty',
                    ],
                ];

                expect(
                    formatter.handleHeader(B.elmDebug(value)).toJSONML()
                ).to.deep.equal(B.MLDebug(expected));
            });
            it('Nonempty dict should show Dict(#count)', () => {
                const value = B.dict({ a: 'b', b: 'a' });

                const expected = [
                    [
                        'span',
                        { style: 'color: darkgreen; font-weight: normal;' },
                        'Dict',
                        ['span', {}, '(2)'],
                    ],
                ];

                expect(
                    formatter.handleHeader(B.elmDebug(value)).toJSONML()
                ).to.deep.equal(B.MLDebug(expected));
            });
        });
        describe('should return values for internals', () => {
            it('Function', () => {
                const value = { type: 'Function' };
                const expected = [
                    [
                        'span',
                        {
                            style:
                                'color: grey; font-weight: normal; font-style: italic;',
                        },
                        '<function>',
                    ],
                ];

                expect(
                    formatter.handleHeader(B.elmDebug(value)).toJSONML()
                ).to.deep.equal(B.MLDebug(expected));
            });
            it('Internals', () => {
                const value = { type: 'Internals' };
                const expected = [
                    [
                        'span',
                        {
                            style:
                                'color: grey; font-weight: normal; font-style: italic;',
                        },
                        '<internals>',
                    ],
                ];

                expect(
                    formatter.handleHeader(B.elmDebug(value)).toJSONML()
                ).to.deep.equal(B.MLDebug(expected));
            });
            it('Unit', () => {
                const value = { type: 'Unit' };
                const expected = [
                    [
                        'span',
                        {
                            style:
                                'color: grey; font-weight: normal; font-style: italic;',
                        },
                        '()',
                    ],
                ];

                expect(
                    formatter.handleHeader(B.elmDebug(value)).toJSONML()
                ).to.deep.equal(B.MLDebug(expected));
            });
        });
        describe('should handle values for bytes and files', () => {
            it('Bytes', () => {
                const value = { type: 'Bytes', value: 1234 };
                const expected = [
                    [
                        'span',
                        {
                            style: 'color: black; font-weight: normal;',
                        },
                        '1234 B',
                    ],
                ];

                expect(
                    formatter.handleHeader(B.elmDebug(value)).toJSONML()
                ).to.deep.equal(B.MLDebug(expected));
            });

            it('Files', () => {
                const value = { type: 'File', value: 'Name-of_the.file' };
                const expected = [
                    [
                        'span',
                        {
                            style: 'color: black; font-weight: normal;',
                        },
                        'Name-of_the.file',
                    ],
                ];

                expect(
                    formatter.handleHeader(B.elmDebug(value)).toJSONML()
                ).to.deep.equal(B.MLDebug(expected));
            });
        });
    });
    describe('Body values', () => {
        describe('Values without body should return null', () => {
            it('String', () => {
                const value = B.str('String');

                expect(formatter.handleBody(value)).to.be.null;
            });

            it('Number', () => {
                const value = B.n(12);

                expect(formatter.handleBody(value)).to.be.null;
            });

            it('Boolean', () => {
                const value = B.bool(true);

                expect(formatter.handleBody(value)).to.be.null;
            });

            it('Unit', () => {
                const value = { type: 'Unit' };

                expect(formatter.handleBody(value)).to.be.null;
            });
            it('Function', () => {
                const value = { type: 'Function' };

                expect(formatter.handleBody(value)).to.be.null;
            });
            it('Internals', () => {
                const value = { type: 'Internals' };

                expect(formatter.handleBody(value)).to.be.null;
            });
            it('Bytes', () => {
                const value = { type: 'Bytes', value: 1234 };

                expect(formatter.handleBody(value)).to.be.null;
            });
            it('Files', () => {
                const value = { type: 'File', value: 'Some_file.name' };

                expect(formatter.handleBody(value)).to.be.null;
            });
        });

        describe.skip('should handle body of the record values', () => {
            it('Record with one value', () => {
                const value = B.record({ age: B.n(12) });
                const expected = [B.MLKeyValueBody('age', B.n(12))];

                expect(formatter.handleBody(value).toJSONML()).to.equal(
                    B.MLBody(expected)
                );
            });
        });
        describe.skip('should return values for array like structures', () => {
            it('Empty list', () => {
                const value = B.list([], 'List');
                const expected: any = null;

                expect(formatter.handleBody(value)).to.deep.equal(expected);
            });
            it('Array with 2 values', () => {
                const value = B.list([B.n(2), B.n(3)], 'Array');
                const expected: any = [
                    B.MLKeyValueBody('[0]', B.MLNumber(2)),
                    B.MLKeyValueBody('[1]', B.MLNumber(3)),
                ];

                expect(formatter.handleBody(value).toJSONML()).to.deep.equal(
                    B.MLBody(expected)
                );
            });
        });
    });
});

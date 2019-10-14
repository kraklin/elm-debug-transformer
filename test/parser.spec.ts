import { expect, should } from 'chai';
import { readFileSync } from 'fs';
import { generate } from 'pegjs';
import * as B from './builders';

const parser = generate(readFileSync('src/elm-debug.pegjs', 'utf8'));

describe('Parsing', () => {
    describe('Basic type parsing', () => {
        it('without tag tag', () => {
            expect(parser.parse(': True').value).to.deep.equal(B.bool(true));
        });

        it('with multiple `:` in the tag', () => {
            expect(parser.parse('tag string :: : True').value).to.deep.equal(
                B.bool(true)
            );
        });

        it('with numbers in the tag', () => {
          expect(parser.parse('1234567890: True').value).to.deep.equal(
                B.bool(true)
            );
        });

        it('with non alphabetic characters', () => {
          expect(parser.parse('!@#$%^&*()_+-=[]{}|\\,./<>?~`: True').value).to.deep.equal(
                B.bool(true)
            );
        });

        it('with emojis in tag', () => {
          expect(parser.parse('with 1 Emoji 👍 : False').value).to.deep.equal(
                B.bool(false)
            );
        });


        it('Boolean', () => {
            expect(parser.parse('tag string: True').value).to.deep.equal(
                B.bool(true)
            );
        });

        it('Integer', () => {
            expect(parser.parse('integer: 123').value).to.deep.equal({
                type: 'Number',
                value: 123,
            });
        });

        it('Negative Integer', () => {
            expect(parser.parse('integer: - 123').value).to.deep.equal({
                type: 'Number',
                value: -123,
            });
        });

        describe('Non number values', () => {
            it('Infinity', () => {
                expect(parser.parse('integer: Infinity').value).to.deep.equal({
                    type: 'Number',
                    value: 'Infinity',
                });
            });
            it('-Infinity', () => {
                expect(parser.parse('integer: -Infinity').value).to.deep.equal({
                    type: 'Number',
                    value: '-Infinity',
                });
            });
            it('NaN', () => {
                expect(parser.parse('integer: NaN').value).to.deep.equal({
                    type: 'Number',
                    value: 'NaN',
                });
            });
        });

        it('Float', () => {
            expect(parser.parse('float: 123.45').value).to.deep.equal({
                type: 'Number',
                value: 123.45,
            });
        });

        it('Negative Float', () => {
            expect(parser.parse('float: - 123.45').value).to.deep.equal({
                type: 'Number',
                value: -123.45,
            });
        });

        it('String', () => {
            expect(parser.parse('string: "Lorem Ipsum."').value).to.deep.equal(
                B.str('Lorem Ipsum.')
            );
        });

        it('String with escaped quotes', () => {
            expect(
                parser.parse('string: "Lorem Ipsum. \\"with some quotes\\""')
                    .value
            ).to.deep.equal(B.str('Lorem Ipsum. "with some quotes"'));
        });
    });

    describe('Tuples', () => {
        it('Empty tuple', () => {
            expect(parser.parse('tuple: ()').value).to.deep.equal({
                type: 'Unit',
            });
        });

        it('Basic tuple', () => {
            expect(parser.parse('tuple: (123, False)').value).to.deep.equal({
                type: 'Tuple',
                value: [{ type: 'Number', value: 123 }, B.bool(false)],
            });
        });

        it('Arbitrary long tuple', () => {
            expect(
                parser.parse('tuple: (123, "Some string.", True, 12.34)').value
            ).to.deep.equal({
                type: 'Tuple',
                value: [
                    { type: 'Number', value: 123 },
                    B.str('Some string.'),
                    B.bool(true),
                    { type: 'Number', value: 12.34 },
                ],
            });
        });

        it('Tuple in tuple', () => {
            expect(
                parser.parse('tuple in tuple: (123, (True, 12.34))').value
            ).to.deep.equal({
                type: 'Tuple',
                value: [
                    { type: 'Number', value: 123 },
                    {
                        type: 'Tuple',
                        value: [B.bool(true), { type: 'Number', value: 12.34 }],
                    },
                ],
            });
        });
    });

    describe('List', () => {
        it('Empty list', () => {
            expect(parser.parse('list: []').value).to.deep.equal({
                type: 'List',
                value: [],
            });
        });

        it('Singleton', () => {
            expect(parser.parse('singleton: [1]').value).to.deep.equal({
                type: 'List',
                value: [{ type: 'Number', value: 1 }],
            });
        });
        it('List', () => {
            expect(
                parser.parse('list: ["s1","s2","s3","s4"]').value
            ).to.deep.equal({
                type: 'List',
                value: [B.str('s1'), B.str('s2'), B.str('s3'), B.str('s4')],
            });
        });
        it('List of tuples', () => {
            expect(
                parser.parse('list: [("s1","s2"),("s3","s4")]').value
            ).to.deep.equal({
                type: 'List',
                value: [
                    { type: 'Tuple', value: [B.str('s1'), B.str('s2')] },
                    { type: 'Tuple', value: [B.str('s3'), B.str('s4')] },
                ],
            });
        });
    });

    describe('Dict', () => {
        it('Empty dict', () => {
            expect(parser.parse('dict: Dict.fromList []').value).to.deep.equal({
                type: 'Dict',
                value: [],
            });
        });
        it('Filled dict', () => {
            expect(
                parser.parse('dict: Dict.fromList [(1,"a"),(2,"b")]').value
            ).to.deep.equal({
                type: 'Dict',
                value: [
                    { key: { type: 'Number', value: 1 }, value: B.str('a') },
                    { key: { type: 'Number', value: 2 }, value: B.str('b') },
                ],
            });
        });
    });

    describe('Set', () => {
        it('Empty Set', () => {
            expect(parser.parse('Set: Set.fromList []').value).to.deep.equal({
                type: 'Set',
                value: [],
            });
        });
        it('Filled set', () => {
            expect(
                parser.parse('Set: Set.fromList ["1","2","3"]').value
            ).to.deep.equal({
                type: 'Set',
                value: [B.str('1'), B.str('2'), B.str('3')],
            });
        });
    });

    describe('Array', () => {
        it('Empty Array', () => {
            expect(
                parser.parse('Array: Array.fromList []').value
            ).to.deep.equal({ type: 'Array', value: [] });
        });
        it('Filled Array', () => {
            expect(
                parser.parse('Array: Array.fromList ["1","2","3"]').value
            ).to.deep.equal({
                type: 'Array',
                value: [B.str('1'), B.str('2'), B.str('3')],
            });
        });
    });

    describe('Record', () => {
        it('Empty record', () => {
            expect(parser.parse('record: {}').value).to.deep.equal({
                type: 'Record',
                value: {},
            });
        });
        it('Record', () => {
            expect(
                parser.parse('record: { name = "Name" }').value
            ).to.deep.equal({
                type: 'Record',
                value: { name: B.str('Name') },
            });
        });
        it('Record with more values', () => {
            expect(
                parser.parse(
                    'record: { name = "Name", warning = Nothing, waves = [] }'
                ).value
            ).to.deep.equal({
                type: 'Record',
                value: {
                    name: B.str('Name'),
                    warning: { type: 'Type', name: 'Nothing' },
                    waves: { type: 'List', value: [] },
                },
            });
        });
        it('Nested records', () => {
            expect(
                parser.parse(
                    'record: { name = "Name", warning = { name = Nothing, waves = [] } }'
                ).value
            ).to.deep.equal({
                type: 'Record',
                value: {
                    name: B.str('Name'),
                    warning: {
                        type: 'Record',
                        value: {
                            name: { type: 'Type', name: 'Nothing' },
                            waves: { type: 'List', value: [] },
                        },
                    },
                },
            });
        });
        it('Vector', () => {
            expect(
                parser.parse('vec: { 0 = 0, 1 = 0, 2 = 0 }').value
            ).to.deep.equal({
                type: 'Record',
                value: {
                    '0': { type: 'Number', value: 0 },
                    '1': { type: 'Number', value: 0 },
                    '2': { type: 'Number', value: 0 },
                },
            });
        });
    });

    describe('Custom types', () => {
        it('Custom type with one value', () => {
            expect(
                parser.parse('custom type: User "Adam"').value
            ).to.deep.equal({
                name: 'User',
                type: 'Custom',
                value: [B.str('Adam')],
            });
        });
        it('Custom type with more values', () => {
            expect(
                parser.parse('custom type: User "Adam" 123 (1,False)').value
            ).to.deep.equal({
                name: 'User',
                type: 'Custom',
                value: [
                    B.str('Adam'),
                    { type: 'Number', value: 123 },
                    {
                        type: 'Tuple',
                        value: [{ type: 'Number', value: 1 }, B.bool(false)],
                    },
                ],
            });
        });
        it('Custom type in parenthesis', () => {
            expect(
                parser.parse('custom type: (User (Data "Adam" 123 (1,False)))')
                    .value
            ).to.deep.equal({
                name: 'User',
                type: 'Custom',
                value: [
                    {
                        name: 'Data',
                        type: 'Custom',
                        value: [
                            B.str('Adam'),
                            { type: 'Number', value: 123 },
                            {
                                type: 'Tuple',
                                value: [
                                    { type: 'Number', value: 1 },
                                    B.bool(false),
                                ],
                            },
                        ],
                    },
                ],
            });
        });
        it('Custom type in parenthesis with record', () => {
            expect(
                parser.parse('custom type: (User { age = 23 })').value
            ).to.deep.equal({
                name: 'User',
                type: 'Custom',
                value: [
                    {
                        type: 'Record',
                        value: { age: { type: 'Number', value: 23 } },
                    },
                ],
            });
        });
        it('Custom type with more values in parenthesis', () => {
            expect(
                parser.parse(
                    'custom type: User (Data "(tuple, in, string)" 123 (1,False))'
                ).value
            ).to.deep.equal({
                name: 'User',
                type: 'Custom',
                value: [
                    {
                        name: 'Data',
                        type: 'Custom',
                        value: [
                            B.str('(tuple, in, string)'),
                            { type: 'Number', value: 123 },
                            {
                                type: 'Tuple',
                                value: [
                                    { type: 'Number', value: 1 },
                                    B.bool(false),
                                ],
                            },
                        ],
                    },
                ],
            });
        });
    });

    describe('Internals', () => {
        it('Function value', () => {
            expect(parser.parse('custom type: <function>').value).to.deep.equal(
                { type: 'Function' }
            );
        });
        it('Internals value', () => {
            expect(
                parser.parse('custom type: <internals>').value
            ).to.deep.equal({ type: 'Internals' });
        });
    });

    describe('Bytes', () => {
        it('Bytes', () => {
            expect(parser.parse('bytes: <24294 bytes>').value).to.deep.equal({
                type: 'Bytes',
                value: 24294,
            });
        });
    });

    describe('File', () => {
        it('File', () => {
            expect(
                parser.parse(
                    'file: <Some-name-[and]_extrachars(0000239649).extension>'
                ).value
            ).to.deep.equal({
                type: 'File',
                value: 'Some-name-[and]_extrachars(0000239649).extension',
            });
        });
    });
});

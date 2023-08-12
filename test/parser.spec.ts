import { describe, expect, should, it} from 'vitest';
import { readFileSync } from 'fs';
import { generate } from 'pegjs';
import { parse } from '../src/index';
import * as B from './builders';

describe('Parsing', () => {
    describe('Basic type parsing', () => {
        it.skip('without tag tag', async () => {
            const result = await parse(': True');
            expect(result.value).to.deep.equal(B.bool(true));
        });

        it.skip('with multiple `:` in the tag', () => {
            expect(parse('tag string :: : True').value).to.deep.equal(
                B.bool(true)
            );
        });

        it.only('with numbers in the tag', async () => {
          const result = await parse('debug: True');
          expect(result.value).to.deep.equal(
                B.bool(true)
            );
        });

        it('with non alphabetic characters', () => {
          expect(parse('!@#$%^&*()_+-=[]{}|\\,./<>?~`: True').value).to.deep.equal(
                B.bool(true)
            );
        });

        it('with emojis in tag', () => {
          expect(parse('with 1 Emoji 👍 : False').value).to.deep.equal(
                B.bool(false)
            );
        });


        it('Boolean', () => {
            expect(parse('tag string: True').value).to.deep.equal(
                B.bool(true)
            );
        });

        it('Integer', () => {
            expect(parse('integer: 123').value).to.deep.equal({
                type: 'Number',
                value: 123,
            });
        });

        it('Negative Integer', () => {
            expect(parse('integer: - 123').value).to.deep.equal({
                type: 'Number',
                value: -123,
            });
        });

        describe('Non number values', () => {
            it('Infinity', () => {
                expect(parse('integer: Infinity').value).to.deep.equal({
                    type: 'Number',
                    value: 'Infinity',
                });
            });
            it('-Infinity', () => {
                expect(parse('integer: -Infinity').value).to.deep.equal({
                    type: 'Number',
                    value: '-Infinity',
                });
            });
            it('NaN', () => {
                expect(parse('integer: NaN').value).to.deep.equal({
                    type: 'Number',
                    value: 'NaN',
                });
            });
        });

        it('Float', () => {
            expect(parse('float: 123.45').value).to.deep.equal({
                type: 'Number',
                value: 123.45,
            });
        });

        it('Negative Float', () => {
            expect(parse('float: - 123.45').value).to.deep.equal({
                type: 'Number',
                value: -123.45,
            });
        });

        it('String', () => {
            expect(parse('string: "Lorem Ipsum."').value).to.deep.equal(
                B.str('Lorem Ipsum.')
            );
        });

        it('String with escaped quotes', () => {
            expect(
                parse('string: "Lorem Ipsum. \\"with some quotes\\""')
                    .value
            ).to.deep.equal(B.str('Lorem Ipsum. "with some quotes"'));
        });
    });

    describe('Tuples', () => {
        it('Empty tuple', () => {
            expect(parse('tuple: ()').value).to.deep.equal({
                type: 'Unit',
            });
        });

        it('Basic tuple', () => {
            expect(parse('tuple: (123, False)').value).to.deep.equal({
                type: 'Tuple',
                value: [{ type: 'Number', value: 123 }, B.bool(false)],
            });
        });

        it('Arbitrary long tuple', () => {
            expect(
                parse('tuple: (123, "Some string.", True, 12.34)').value
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
                parse('tuple in tuple: (123, (True, 12.34))').value
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
        it('Tuple with one item is not a tuple', () => new Promise(done => { 
          try {
                parse('not tuple: (123)');
          }
          catch (err: any){
            expect(err.name).to.eql('SyntaxError')
          }
          done();
        }));
    });

    describe('List', () => {
        it('Empty list', () => {
            expect(parse('list: []').value).to.deep.equal({
                type: 'List',
                value: [],
            });
        });

        it('Singleton', () => {
            expect(parse('singleton: [1]').value).to.deep.equal({
                type: 'List',
                value: [{ type: 'Number', value: 1 }],
            });
        });
        it('List', () => {
            expect(
                parse('list: ["s1","s2","s3","s4"]').value
            ).to.deep.equal({
                type: 'List',
                value: [B.str('s1'), B.str('s2'), B.str('s3'), B.str('s4')],
            });
        });
        it('List of tuples', () => {
            expect(
                parse('list: [("s1","s2"),("s3","s4")]').value
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
            expect(parse('dict: Dict.fromList []').value).to.deep.equal({
                type: 'Dict',
                value: [],
            });
        });
        it('Filled dict', () => {
            expect(
                parse('dict: Dict.fromList [(1,"a"),(2,"b")]').value
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
            expect(parse('Set: Set.fromList []').value).to.deep.equal({
                type: 'Set',
                value: [],
            });
        });
        it('Filled set', () => {
            expect(
                parse('Set: Set.fromList ["1","2","3"]').value
            ).to.deep.equal({
                type: 'Set',
                value: [B.str('1'), B.str('2'), B.str('3')],
            });
        });
    });

    describe('Array', () => {
        it('Empty Array', () => {
            expect(
                parse('Array: Array.fromList []').value
            ).to.deep.equal({ type: 'Array', value: [] });
        });
        it('Filled Array', () => {
            expect(
                parse('Array: Array.fromList ["1","2","3"]').value
            ).to.deep.equal({
                type: 'Array',
                value: [B.str('1'), B.str('2'), B.str('3')],
            });
        });
    });

    describe('Record', () => {
        it('Empty record', () => {
            expect(parse('record: {}').value).to.deep.equal({
                type: 'Record',
                value: {},
            });
        });
        it('Record', () => {
            expect(
                parse('record: { name = "Name" }').value
            ).to.deep.equal({
                type: 'Record',
                value: { name: B.str('Name') },
            });
        });
        it('Record with more values', () => {
            expect(
                parse(
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
                parse(
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
                parse('vec: { 0 = 0, 1 = 0, 2 = 0 }').value
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
        it('Custom type name with number', () => {
            expect(
                parse('custom type: User1 "Adam"').value
            ).to.deep.equal({
                name: 'User1',
                type: 'Custom',
                value: [B.str('Adam')],
            });
        });
        it('Custom type name with underscore', () => {
            expect(
                parse('custom type: User_name "Adam"').value
            ).to.deep.equal({
                name: 'User_name',
                type: 'Custom',
                value: [B.str('Adam')],
            });
        });
        it('Custom type with one value', () => {
            expect(
                parse('custom type: User "Adam"').value
            ).to.deep.equal({
                name: 'User',
                type: 'Custom',
                value: [B.str('Adam')],
            });
        });
        it('Custom type with more values', () => {
            expect(
                parse('custom type: User "Adam" 123 (1,False)').value
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
                parse('custom type: (User (Data "Adam" 123 (1,False)))')
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
                parse('custom type: (User { age = 23 })').value
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
        it('Custom type with two Nothings next to each other', () => {
            expect(
                parse(
                    'custom type: CacheKey (Id "cache_id") Nothing Nothing'
                ).value
            ).to.deep.equal({
                name: 'CacheKey',
                type: 'Custom',
                value: [
                    {
                      name: 'Id',
                      type: 'Custom',
                      value: [
                        {type: 'String',
                        value: "cache_id"
                        }
                      ]
                    }
                    ,{
                      name: 'Nothing',
                      type: 'Type',
                    }
                    ,{
                      name: 'Nothing',
                      type: 'Type',
                    }
                ],

            });
        });
        it('Custom type with more values in parenthesis', () => {
            expect(
                parse(
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
            expect(parse('custom type: <function>').value).to.deep.equal(
                { type: 'Function' }
            );
        });
        it('Internals value', () => {
            expect(
                parse('custom type: <internals>').value
            ).to.deep.equal({ type: 'Internals' });
        });
    });

    describe('Bytes', () => {
        it('Bytes', () => {
            expect(parse('bytes: <24294 bytes>').value).to.deep.equal({
                type: 'Bytes',
                value: 24294,
            });
        });
    });

    describe('File', () => {
        it('File', () => {
            expect(
                parse(
                    'file: <Some-name-[and]_extrachars(0000239649).extension>'
                ).value
            ).to.deep.equal({
                type: 'File',
                value: 'Some-name-[and]_extrachars(0000239649).extension',
            });
        });
    });
});

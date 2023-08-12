import { describe, expect, should, it} from 'vitest';
import { readFileSync } from 'fs';
import { generate } from 'pegjs';
import { parse } from '../src/index';
import * as B from './builders';

describe('Parsing', () => {
    describe('Basic type parsing', () => {
        it('without tag tag', async () => {
            const result = await parse(': True');
            expect(result.value).to.deep.equal(B.bool(true));
        });

        it.skip('with multiple `:` in the tag', async () => {
            const result = await parse('tag string :: : True')
            expect(result.value).to.deep.equal(
                B.bool(true)
            );
        });

        it('with numbers in the tag', async () => {
          const result = await parse('debug: True');
          expect(result.value).to.deep.equal(
                B.bool(true)
            );
        });

        it('with non alphabetic characters', async () => {
          const result = await parse('!@#$%^&*()_+-=[]{}|\\,./<>?~`: True');
          expect(result.value).to.deep.equal(
                B.bool(true)
            );
        });

        it('with emojis in tag', async () => {
          const result = await parse('with 1 Emoji 👍 : False');
          expect(result.value).to.deep.equal(
                B.bool(false)
            );
        });


        it('Boolean', async () => {
            const result = await parse('tag string: True');
            expect(result.value).to.deep.equal(
                B.bool(true)
            );
        });

        it('Integer', async () => {
            const result = await parse('integer: 123');
            expect(result.value).to.deep.equal({
                type: 'Number',
                value: 123,
            });
        });

        it('Negative Integer', async () => {
            const result = await parse('integer: -123')
            expect(result.value).to.deep.equal({
                type: 'Number',
                value: -123,
            });
        });

        describe('Non number values', () => {
            it('Infinity', async () => {
                const result = await parse('integer: Infinity')
                expect(result.value).to.deep.equal({
                    type: 'Number',
                    value: 'Infinity',
                });
            });
            it('-Infinity', async () => {
                const result = await parse('integer: -Infinity')
                expect(result.value).to.deep.equal({
                    type: 'Number',
                    value: '-Infinity',
                });
            });
            it('NaN', async () => {
                const result = await parse('integer: NaN')
                expect(result.value).to.deep.equal({
                    type: 'Number',
                    value: 'NaN',
                });
            });
        });

        it('Float', async () => {
            const result = await parse('float: 123.45');
            expect(result.value).to.deep.equal({
                type: 'Number',
                value: 123.45,
            });
        });

        it('Negative Float', async () => {
            const result = await parse('float: -123.45');
            expect(result.value).to.deep.equal({
                type: 'Number',
                value: -123.45,
            });
        });

        it('String', async () => {
          const {value} = await parse('string: "Lorem Ipsum."');
            expect(value).to.deep.equal(
                B.str('Lorem Ipsum.')
            );
        });

        it('String with escaped quotes', async () => {
            const {value} = await parse('string: "Lorem Ipsum. \\"with some quotes\\""')
            expect(value).to.deep.equal(B.str('Lorem Ipsum. "with some quotes"'));
        });
    });

    describe('Tuples', () => {
        it('Empty tuple', async () => {
            const {value} = await parse('tuple: ()');
            expect(value).to.deep.equal({
                type: 'Unit',
            });
        });

        it('Basic tuple', async () => {
            const {value} = await parse('tuple: (123, False)');
            expect(value).to.deep.equal({
                type: 'Tuple',
                value: [{ type: 'Number', value: 123 }, B.bool(false)],
            });
        });

        it('Triplet', async () => {
            const {value} = await parse('tuple: (123, "Some string.", True)');
            expect(value).to.deep.equal({
                type: 'Tuple',
                value: [
                    { type: 'Number', value: 123 },
                    B.str('Some string.'),
                    B.bool(true)
                ],
            });
        });

        it('Tuple in tuple', async () => {
            const {value} = await parse('tuple in tuple: (123, (True, 12.34))');
            expect( value ).to.deep.equal({
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
        it.skip('Tuple with one item is not a tuple', () => new Promise(done => { 
          try {
                parse('not tuple: (123, 1234)');
          }
          catch (err: any){
            expect(err.name).to.eql('SyntaxError')
          }
          done();
        }));
    });

    describe('List', () => {
        it('Empty list', async () => {
            const {value} = await parse('list: []') 
            expect(value).to.deep.equal({
                type: 'List',
                value: [],
            });
        });

        it('Singleton', async () => {
            const {value} = await parse('singleton: [1]');
            expect(value).to.deep.equal({
                type: 'List',
                value: [{ type: 'Number', value: 1 }],
            });
        });
        it('List', async () => {
            const {value} = await parse('list: ["s1","s2","s3","s4"]');
            expect(value).to.deep.equal({
                type: 'List',
                value: [B.str('s1'), B.str('s2'), B.str('s3'), B.str('s4')],
            });
        });
        it('List of tuples', async () => {
            const {value} = await parse('list: [("s1","s2"),("s3","s4")]');
            expect(value).to.deep.equal({
                type: 'List',
                value: [
                    { type: 'Tuple', value: [B.str('s1'), B.str('s2')] },
                    { type: 'Tuple', value: [B.str('s3'), B.str('s4')] },
                ],
            });
        });
    });

    describe('Dict', () => {
        it('Empty dict', async () => {
            const {value} = await parse('dict: Dict.fromList []');
            expect(value).to.deep.equal({
                type: 'Dict',
                value: [],
            });
        });
        it('Filled dict', async () => {
            const {value} = await parse('dict: Dict.fromList [(1,"a"),(2,"b")]');
            expect(value).to.deep.equal({
                type: 'Dict',
                value: [
                    { key: { type: 'Number', value: 1 }, value: B.str('a') },
                    { key: { type: 'Number', value: 2 }, value: B.str('b') },
                ],
            });
        });
    });

    describe.skip('Set', () => {
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

    describe.skip('Array', () => {
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

    describe.skip('Record', () => {
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

    describe.skip('Custom types', () => {
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
        it('Function value', async () => {
            const {value} = await parse('custom type: <function>');
            expect(value).to.deep.equal(
                { type: 'Function' }
            );
        });
        it('Internals value', async () => {
            const {value} = await parse('custom type: <internals>'); 
            expect(value).to.deep.equal({ type: 'Internals' });
        });
    });

    describe('Bytes', () => {
        it('Bytes', async () => {
            const {value} = await parse('bytes: <24294 bytes>');
            expect(value).to.deep.equal({
                type: 'Bytes',
                value: 24294,
            });
        });
    });

    describe('File', () => {
        it('File', async () => {
            const {value} = await parse( 'file: <Some-name-[and]_extrachars(0000239649).extension>');
            expect(value).to.deep.equal({
                type: 'File',
                value: 'Some-name-[and]_extrachars(0000239649).extension',
            });
        });
    });
});

import { expect } from 'chai';
import * as _ from 'lodash';
import {
    IChromeConsoleFormatter,
    IElmDebugListValue,
    IElmDebugRecordValue,
    IElmDebugValue,
} from '../src/CommonTypes';
import ChromeFormatter from '../src/formatters/ChromeConsoleFormatter';

function elmDebug(values: any): IElmDebugValue {
    return { type: 'ElmDebug', name: 'Debug', value: values };
}

function list(typeName: string, values: any[]): IElmDebugListValue {
    return { type: typeName, value: values };
}

function record(values: { [key: string]: any }): IElmDebugRecordValue {
    return { type: 'Record', value: values };
}

function n(val: number) {
    return { type: 'Number', value: val };
}

function tuple(values: any[]) {
    return { type: 'Tuple', value: values };
}

function customType(name: string, values: any[]) {
    return { type: 'Custom', name, value: values };
}

function type(name: string) {
    return { type: 'Type', name };
}

function dict(dictionary: object) {
    return {
        type: 'Dict',
        value: _.toPairs(dictionary).map(item => {
            return { key: item[0], value: item[1] };
        }),
    };
}

function MLDebug(values: any[]): any[] {
    return ['div', {}, ['span', {}, 'Debug: '], ...values];
}
function MLString(str: string): any[] {
    return ['span', { style: 'color: blue; font-weight: normal;' }, `"${str}"`];
}

function MLNumber(num: number): any[] {
    return [
        'span',
        { style: 'color: purple; font-weight: normal;' },
        num.toString(),
    ];
}

function MLBool(bool: boolean): any[] {
    return [
        'span',
        { style: 'color: blue; font-weight: normal;' },
        bool ? 'True' : 'False',
    ];
}

function MLList(typeName: string, length: number): any[] {
    if (length === 0) {
        return ['span', { style: 'color: grey; font-weight: normal;' }, '[]'];
    } else {
        return [
            'span',
            { style: 'color: darkgreen; font-weight: normal;' },
            typeName,
            ['span', {}, `(${length})`],
        ];
    }
}

function MLCustomType(name: string, value?: any): any[] {
    if (value === undefined) {
        return [
            'span',
            { style: 'color: darkgreen; font-weight: normal;' },
            name,
        ];
    }

    return [
        'span',
        { style: 'color: darkgreen; font-weight: normal;' },
        name + ' ',
        value,
    ];
}

function MLTuple(values: any[]): any[] {
    // const vals = values.map(v => v);
    const valuesWithCommas = values.reduce((acc: any[], v) => {
        acc.push(['span', {}, ', ']);
        acc.push(v);
        return acc;
    }, []);
    valuesWithCommas.splice(0, 1);
    valuesWithCommas.push(' )');

    return ['span', {}, '( ', ...valuesWithCommas];
}

function MLEllipsis(): any[] {
    return ['span', { style: 'color: gray; font-weight: normal;' }, '...'];
}

function MLRecord(values: any[]) {
    const valuesWithCommas = values.reduce((acc, item) => {
        acc.push(['span', {}, ', ']);
        acc.push(item);
        return acc;
    }, []);

    valuesWithCommas.splice(0, 1);

    return ['span', {}, '{ '].concat(valuesWithCommas).concat([' }']);
}

function MLRecordValue(name: string, value: any): any[] {
    return [
        'span',
        { style: 'color: purple; font-weight: bold;' },
        name + ': ',
        value,
    ];
}

let formatter: IChromeConsoleFormatter;

beforeEach(() => {
    formatter = new ChromeFormatter();
});

describe('JSONML formatting', () => {
    describe('Header values', () => {
        describe('should return values for simple values', () => {
            it('string', () => {
                const value = 'string';
                const expected = [MLString('string')];

                expect(
                    formatter.handleHeader(elmDebug(value)).toJSONML()
                ).to.deep.equal(MLDebug(expected));
            });

            it('number', () => {
                const value = n(1);
                const expected = [MLNumber(1)];

                expect(
                    formatter.handleHeader(elmDebug(value)).toJSONML()
                ).to.deep.equal(MLDebug(expected));
            });

            it('boolean True', () => {
                const value = true;
                const expected = [MLBool(true)];

                expect(
                    formatter.handleHeader(elmDebug(value)).toJSONML()
                ).to.deep.equal(MLDebug(expected));
            });

            it('boolean False', () => {
                const value = false;
                const expected = [MLBool(false)];

                expect(
                    formatter.handleHeader(elmDebug(value)).toJSONML()
                ).to.deep.equal(MLDebug(expected));
            });
        });
        describe('should return values for array like structures', () => {
            it('Empty list', () => {
                const value = list('List', []);
                const expected = [MLList('List', 0)];

                expect(
                    formatter.handleHeader(elmDebug(value)).toJSONML()
                ).to.deep.equal(MLDebug(expected));
            });

            it('Array with one value', () => {
                const value = list('Array', [n(1)]);
                const expected = [MLList('Array', 1)];

                expect(
                    formatter.handleHeader(elmDebug(value)).toJSONML()
                ).to.deep.equal(MLDebug(expected));
            });

            it('Set with more values', () => {
                const value = list('Set', ['a', 'b', 'c']);
                const expected = [MLList('Set', 3)];

                expect(
                    formatter.handleHeader(elmDebug(value)).toJSONML()
                ).to.deep.equal(MLDebug(expected));
            });

            it('Tuple with three values', () => {
                const value = tuple(['a', 'b', 'c']);
                const expected = [
                    MLTuple([MLString('a'), MLString('b'), MLString('c')]),
                ];

                expect(
                    formatter.handleHeader(elmDebug(value)).toJSONML()
                ).to.deep.equal(MLDebug(expected));
            });
        });
        describe('should handle Types and Custom types', () => {
            it('Type', () => {
                const value = type('Nothing');
                const expected = [MLCustomType('Nothing')];

                expect(
                    formatter.handleHeader(elmDebug(value)).toJSONML()
                ).to.deep.equal(MLDebug(expected));
            });
            it('CustomType without values', () => {
                const value = customType('CustomType', []);
                const expected = [MLCustomType('CustomType')];

                expect(
                    formatter.handleHeader(elmDebug(value)).toJSONML()
                ).to.deep.equal(MLDebug(expected));
            });
            it('CustomType with one value', () => {
                const value = customType('CustomType', [n(1)]);
                const expected = [MLCustomType('CustomType', MLNumber(1))];

                expect(
                    formatter.handleHeader(elmDebug(value)).toJSONML()
                ).to.deep.equal(MLDebug(expected));
            });
            it('CustomType with two values', () => {
                const value = customType('CustomType', [n(1), n(1)]);
                const expected = [MLCustomType('CustomType', MLEllipsis())];

                expect(
                    formatter.handleHeader(elmDebug(value)).toJSONML()
                ).to.deep.equal(MLDebug(expected));
            });
        });
        describe('should handle Records', () => {
            it('simple record', () => {
                const value = record({ name: 'Name' });
                const expected = [
                    MLRecord([MLRecordValue('name', MLString('Name'))]),
                ];

                expect(
                    formatter.handleHeader(elmDebug(value)).toJSONML()
                ).to.deep.equal(MLDebug(expected));
            });
            it('record with two values', () => {
                const value = record({ name: 'Name', age: n(12) });
                const expected = [
                    MLRecord([
                        MLRecordValue('name', MLString('Name')),
                        MLRecordValue('age', MLNumber(12)),
                    ]),
                ];

                expect(
                    formatter.handleHeader(elmDebug(value)).toJSONML()
                ).to.deep.equal(MLDebug(expected));
            });
            it('record with long child content should be truncated to 50 chars', () => {
                const value = record({
                    name: 'Name',
                    string:
                        'Some really long string to simulate long content for the record',
                });
                const expected = [
                    MLRecord([
                        MLRecordValue('name', MLString('Name')),
                        MLEllipsis(),
                    ]),
                ];

                expect(
                    formatter.handleHeader(elmDebug(value)).toJSONML()
                ).to.deep.equal(MLDebug(expected));
            });
            it('record with long child content continued with short child content shoul not show the short one', () => {
                const value = record({
                    a: 'a',
                    b:
                        'Some really long string to simulate long content for the record',
                    c: 'c',
                });
                const expected = [
                    MLRecord([MLRecordValue('a', MLString('a')), MLEllipsis()]),
                ];

                expect(
                    formatter.handleHeader(elmDebug(value)).toJSONML()
                ).to.deep.equal(MLDebug(expected));
            });
        });

        // TODO: Dict, Internals, Function, Unit, Files, Bytes
    });
});
/*
    describe('should return values for records', () => {
        it('simple record', () => {
            expect(
                formatter.format(elmDebug(record({ name: 'Name', age: 12 })))
            ).to.deep.equal({ Debug: { name: 'Name', age: 12 } });
        });
    });

    describe('should return values for dictionaries', () => {
        it('handles simple record', () => {
            const value = elmDebug(dict({ name: 'Name', age: '12' }));

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
            const value = elmDebug({ type: 'Function' });

            expect(formatter.format(value)).to.deep.equal({
                Debug: '<function>',
            });
        });

        it('Internals', () => {
            const value = elmDebug({ type: 'Internals' });

            expect(formatter.format(value)).to.deep.equal({
                Debug: '<internals>',
            });
        });
    });

    describe('should return values for bytes and files', () => {
        it('Bytes', () => {
            const value = elmDebug({ type: 'Bytes', value: 1234 });

            expect(formatter.format(value)).to.deep.equal({ Debug: '1234 B' });
        });

        it('Files', () => {
            const value = elmDebug({ type: 'File', value: 'Name-of_the.file' });

            expect(formatter.format(value)).to.deep.equal({
                Debug: 'Name-of_the.file',
            });
        });
    });
});

*/

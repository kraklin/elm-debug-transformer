import * as _ from 'lodash';
import {
    IElmDebugListValue,
    IElmDebugRecordValue,
    IElmDebugValue,
    IFormatter,
} from '../src/CommonTypes';
import * as Styles from '../src/formatters/elements/Styles';

export function elmDebug(values: any): IElmDebugValue {
    return { type: 'ElmDebug', name: 'Debug', value: values };
}

export function list(
    values: any[],
    typeName: string = 'List'
): IElmDebugListValue {
    return { type: typeName, value: values };
}

export function record(values: { [key: string]: any }): IElmDebugRecordValue {
    return { type: 'Record', value: values };
}

export function n(val: number) {
    return { type: 'Number', value: val };
}

export function customType(name: string, values: any[]) {
    return { type: 'Custom', name, value: values };
}

export function type(name: string) {
    return { type: 'Type', name };
}

export function dict(dictionary: object) {
    return {
        type: 'Dict',
        value: _.toPairs(dictionary).map(item => {
            return { key: item[0], value: item[1] };
        }),
    };
}
export function tuple(values: any[]): IElmDebugListValue {
    return { type: 'Tuple', value: values };
}

export function bool(value: boolean) {
    return { type: 'Boolean', value };
}

export function str(value: string) {
    return { type: 'String', value };
}

export function MLDebug(values: any[]): any[] {
    return [
        'span',
        {},
        ['span', { style: Styles.lightTheme.elmLogoElementStyle }],
        ['span', {}, ['span', { style: Styles.lightTheme.debugTagStyle }, 'Debug'], ': '],
        ...values,
    ];
}
export function MLString(value: string): any[] {
    return ['span', { style: Styles.lightTheme.stringStyle }, `"${value}"`];
}

export function MLNumber(num: number): any[] {
    return ['span', { style: Styles.lightTheme.numberStyle }, num.toString()];
}

export function MLBool(value: boolean): any[] {
    return ['span', { style: Styles.lightTheme.booleanStyle }, value ? 'True' : 'False'];
}

export function MLList(typeName: string, length: number): any[] {
    if (length === 0) {
        return ['span', { style: 'color: grey; font-weight: normal;' }, '[]'];
    } else {
        return [
            'span',
            { style: Styles.lightTheme.dataStructureNameStyle },
            typeName,
            ['span', {}, `(${length})`],
        ];
    }
}

export function MLCustomType(name: string, value?: any[]): any[] {
    if (value === undefined) {
        return ['span', { style: Styles.lightTheme.customTypeNameStyle }, name];
    }

    return [
        'span',
        { style: Styles.lightTheme.customTypeNameStyle },
        name + ' ',
        ...value,
    ];
}

export function MLTuple(values: any[]): any[] {
    const valuesWithCommas = values.reduce((acc: any[], v) => {
        acc.push(['span', {}, ', ']);
        acc.push(v);
        return acc;
    }, []);
    valuesWithCommas.splice(0, 1);
    valuesWithCommas.push(' )');

    return ['span', {}, '( ', ...valuesWithCommas];
}

export function MLEllipsis(): any[] {
    return ['span', { style: Styles.lightTheme.greyedStyle }, '…'];
}

export function MLRecord(values: any[]) {
    const valuesWithCommas = values.reduce((acc, item) => {
        acc.push(['span', {}, ', ']);
        acc.push(item);
        return acc;
    }, []);

    valuesWithCommas.splice(0, 1);

    return ['span', {}, '{ '].concat(valuesWithCommas).concat([' }']);
}

export function MLRecordValue(name: string, value: any): any[] {
    return ['span', { style: Styles.lightTheme.keyElementStyle }, name + ': ', value];
}
export function MLKeyValueBody(keyName: string, object: any): any[] {
    const jsonML = [
        'span',
        { style: Styles.lightTheme.keyElementStyle + 'margin-left: 13px;' },
        keyName,
        ': ',
    ];

    const key = {
        attributes: {
            style: Styles.lightTheme.keyElementStyle + 'margin-left: 13px;',
        },
        jsonML,
    };

    return [
        'div',
        {},
        ['object', { config: { elmFormat: true, key }, object }],
    ];
}

export function MLBody(children: any[]) {
    return ['div', { style: 'margin-left: 15px;' }, ...children];
}

export function MLObject(child: any, key: any) {
    return ['object', { object: child, config: { elmFormat: true, key } }];
}

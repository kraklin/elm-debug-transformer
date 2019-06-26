import JsonML from './JsonML';

export interface IFormatter {
    format(obj: IElmDebugValue): any;
}

export interface IJsonMLFormatter {
    handleHeader(obj: ElmDebugValueType, config?: IConfig): JsonML;
    handleBody(obj: ElmDebugValueType): JsonML;
}

export interface IDevToolsFormatter {
    header(obj: ElmDebugValueType, config?: IConfig): any[] | null;
    hasBody(obj: ElmDebugValueType, config?: IConfig): boolean;
    body(obj: ElmDebugValueType, config?: IConfig): any[] | null;
}

export interface IFormatterElement {
    header(): JsonML;
    body?(): JsonML | null;
}

export interface IConfig {
    elmFormat: boolean;
    key: JsonML | null;
}

export type ElmDebugValueType =
    | IElmDebugValue
    | IElmDebugCustomValue
    | IElmDebugRecordValue
    | IElmDebugListValue
    | IElmDebugDictValue
    | IElmDebugTypeValueType
    | IElmDebugNumberValue
    | IElmDebugStringValue
    | IElmDebugBoolValue;

export interface IElmDebugValue {
    type: string;
    name?: string;
    value?: ElmDebugValueType;
}

export interface IElmDebugCustomValue {
    type: string;
    name: string;
    value: ElmDebugValueType[];
}

export interface IElmDebugTypeValueType {
    type: string;
    name: string;
}

export interface IElmDebugListValue {
    type: string;
    value: ElmDebugValueType[];
}

export interface IElmDebugRecordValue {
    type: string;
    value: { [key: string]: ElmDebugValueType };
}

export interface IElmDebugDictValue {
    type: string;
    value: Array<{ key: string; value: ElmDebugValueType }>;
}

export interface IElmDebugNumberValue {
    type: string;
    value: number;
}

export interface IElmDebugStringValue {
    type: string;
    value: string;
}

export interface IElmDebugBoolValue {
    type: string;
    value: boolean;
}

export function isElmValue(value: any): value is IElmDebugValue {
    return (value as IElmDebugValue).type !== undefined;
}

export function isElmCustomValue(value: any): value is IElmDebugCustomValue {
    return value.type === 'Custom';
}

export function isElmRecordValue(value: any): value is IElmDebugRecordValue {
    return value.type === 'Record';
}

export function isElmListValue(value: any): value is IElmDebugListValue {
    return (
        value.type === 'List' ||
        value.type === 'Array' ||
        value.type === 'Set' ||
        value.type === 'Tuple'
    );
}

export function isElmNumberType(value: any): value is IElmDebugNumberValue {
    return value.type === 'Number';
}

export function isElmTypeValue(value: any): value is IElmDebugTypeValueType {
    return value.type === 'Type';
}

export function isElmDictValue(value: any): value is IElmDebugDictValue {
    return value.type === 'Dict';
}

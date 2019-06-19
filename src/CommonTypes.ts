export interface IFormatter {
    format(obj: IElmDebugValue): any;
}

export interface IConfig {
    elmFormat: boolean;
    key: any;
    level: number;
}

export interface IChromeConsoleFormatter {
    handleHeader(obj: IElmDebugValue, config: IConfig): any;
    handleBody(obj: IElmDebugValue, config: IConfig): any;
    renderLine(key: any, value: any, margin: number): any;
}

export type ElmDebugValueType =
    | IElmDebugValue
    | IElmDebugCustomValue
    | IElmDebugRecordValue
    | IElmDebugListValue
    | IElmDebugDictValue
    | IElmDebugTypeValueType
    | string
    | boolean;

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

export function isElmTypeValue(value: any): value is IElmDebugTypeValueType {
    return value.type === 'Type';
}

export function isElmDictValue(value: any): value is IElmDebugDictValue {
    return value.type === 'Dict';
}

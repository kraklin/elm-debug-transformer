export interface IFormatter {
    format(obj: ElmDebugValue): any;
}

export type Config = {
    elmFormat: boolean;
    key: any;
    level: number;
};

export interface IChromeConsoleFormatter {
    handleHeader(obj: ElmDebugValue, config: Config): any;
    handleBody(obj: ElmDebugValue, config: Config): any;
    renderLine(key: any, value: any, margin: number): any;
}

export type ElmDebugValueType =
    | ElmDebugValue
    | ElmDebugCustomValue
    | ElmDebugRecordValue
    | ElmDebugListValue
    | ElmDebugDictValue
    | ElmDebugTypeValueType
    | string
    | boolean;

export type ElmDebugValue = {
    type: string;
    name?: string;
    value?: ElmDebugValueType;
};

export type ElmDebugCustomValue = {
    type: string;
    name: string;
    value: ElmDebugValueType[];
};

export type ElmDebugTypeValueType = {
    type: string;
    name: string;
};

export type ElmDebugListValue = {
    type: string;
    value: ElmDebugValueType[];
};

export type ElmDebugRecordValue = {
    type: string;
    value: { [key: string]: ElmDebugValueType };
};

export type ElmDebugDictValue = {
    type: string;
    value: { key: string; value: ElmDebugValueType }[];
};

export function isElmValue(value: any): value is ElmDebugValue {
    return (<ElmDebugValue>value).type !== undefined;
}

export function isElmCustomValue(value: any): value is ElmDebugCustomValue {
    return value.type === 'Custom';
}

export function isElmRecordValue(value: any): value is ElmDebugRecordValue {
    return value.type === 'Record';
}

export function isElmListValue(value: any): value is ElmDebugListValue {
    return (
        value.type === 'List' ||
        value.type === 'Array' ||
        value.type === 'Set' ||
        value.type === 'Tuple'
    );
}

export function isElmTypeValue(value: any): value is ElmDebugTypeValueType {
    return value.type === 'Type';
}

export function isElmDictValue(value: any): value is ElmDebugDictValue {
    return value.type === 'Dict';
}

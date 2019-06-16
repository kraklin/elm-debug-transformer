export type ElmDebugValueType =
    | ElmDebugValue
    | ElmDebugCustomValue
    | ElmDebugDictValues
    | ElmDebugRecordValue
    | string
    | number
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

export type ElmDebugRecordValue = {[key: string]: ElmDebugValueType};

export type ElmDebugDictValues = { key: string; value: ElmDebugValueType }[];

export interface IFormatter {
    format(obj: ElmDebugValue): any;
}

export function isElmValue(value: any): value is ElmDebugValue {
    return (<ElmDebugValue>value).type !== undefined;
}

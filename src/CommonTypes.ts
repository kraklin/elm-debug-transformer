export type ElmDebugValueType =
    | ElmDebugValue
    | ElmDebugDictValues
    | object
    | string
    | boolean;

export type ElmDebugDictValues = { key: string; value: ElmDebugValueType }[];

export type ElmDebugValue = {
    type: string;
    name?: string;
    value?: ElmDebugValueType;
};

export interface IFormatter {
    format(obj: ElmDebugValue): any;
}

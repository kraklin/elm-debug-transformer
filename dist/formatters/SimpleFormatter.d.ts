import * as T from '../CommonTypes';
export default class SimpleFormatter implements T.IFormatter {
    format(obj: T.IElmDebugValue): object;
    formatArray(array: T.ElmDebugValueType[]): object[];
    formatCustom(custom: T.IElmDebugCustomValue): {
        [key: string]: any;
    };
    formatValue(formatee: T.ElmDebugValueType): any;
}

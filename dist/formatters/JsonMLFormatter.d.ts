import * as T from '../CommonTypes';
import JsonML from '../JsonML';
declare global {
    interface Window {
        devtoolsFormatters: any;
    }
}
export default class JsonMLFormatter implements T.IFormatter, T.IJsonMLFormatter, T.IDevToolsFormatter {
    theme: T.ITheme;
    constructor(theme: T.ITheme);
    format: (obj: T.IElmDebugValue) => any;
    header: (obj: T.IElmDebugValue, config: T.IConfig) => any[] | null;
    hasBody: (obj: T.IElmDebugValue, config: T.IConfig) => boolean;
    body: (obj: T.IElmDebugValue, config: T.IConfig) => any[] | null;
    handleHeader: (obj: T.ElmDebugValueType | undefined, config?: T.IConfig) => JsonML;
    handleBody: (obj: T.ElmDebugValueType, config?: T.IConfig) => JsonML | null;
}

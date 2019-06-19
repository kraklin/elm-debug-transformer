import * as _ from 'lodash';
import {
    IChromeConsoleFormatter,
    IConfig,
    IElmDebugValue,
    IFormatter,
} from '../CommonTypes';
import ChromeConsoleFormatter from './ChromeConsoleFormatter';

/* tslint:disable */
declare global {
    interface Window {
        devtoolsFormatters: any;
    }
}
/* tslint:enable*/

export default class DevToolsFormatter implements IFormatter {
    public formatter: IChromeConsoleFormatter;

    constructor() {
        this.formatter = new ChromeConsoleFormatter();
        window.devtoolsFormatters = [this];
    }

    public format(obj: IElmDebugValue): any {
        return obj;
    }

    public header(obj: IElmDebugValue, config: IConfig) {
        if (
            (!!obj.type && obj.type === 'ElmDebug') ||
            (!!config && config.elmFormat)
        ) {
            if (config !== undefined) {
                return this.formatter.renderLine(
                    config.key,
                    this.formatter.handleHeader(obj, config),
                    10
                );
            } else {
                return ['div', {}, this.formatter.handleHeader(obj, config)];
            }
        } else {
            return null;
        }
    }
    public hasBody(obj: any) {
        return true;
    }
    public body(obj: any, config: IConfig) {
        return ['div', {}, this.formatter.handleBody(obj, config)];
    }
}

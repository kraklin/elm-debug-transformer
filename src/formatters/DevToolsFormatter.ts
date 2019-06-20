import * as _ from 'lodash';
import {
    IChromeConsoleFormatter,
    IConfig,
    IElmDebugValue,
    IFormatter,
} from '../CommonTypes';
import JsonML from '../JsonML';
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
                return this.formatter
                    .renderLine(
                        config.key,
                        this.formatter.handleHeader(obj),
                        10
                    )
                    .toJSONML();
            } else {
                return new JsonML('div')
                    .withChild(this.formatter.handleHeader(obj))
                    .toJSONML();
            }
        } else {
            return null;
        }
    }
    public hasBody(obj: any) {
        return false;
    }
    public body(obj: any, config: IConfig) {
        return;
        // return this.formatter.handleBody(obj, config).toJSONML();
    }
}

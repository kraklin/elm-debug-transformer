import {
    Config,
    ElmDebugValue,
    IFormatter,
    IChromeConsoleFormatter,
} from '../CommonTypes';
import ChromeConsoleFormatter from './ChromeConsoleFormatter';
import * as _ from 'lodash';

declare global {
    interface Window {
        devtoolsFormatters: any;
    }
}

export default class DevToolsFormatter implements IFormatter {
    formatter: IChromeConsoleFormatter;

    constructor() {
        this.formatter = new ChromeConsoleFormatter();
        window.devtoolsFormatters = [this];
    }

    public format(obj: ElmDebugValue): any {
        return obj;
    }

    header(obj: ElmDebugValue, config: Config) {
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
    hasBody(obj: any) {
        return true;
    }
    body(obj: any, config: Config) {
        return ['div', {}, this.formatter.handleBody(obj, config)];
    }
}

import * as _ from 'lodash';
import * as T from '../CommonTypes';
import JsonML from '../JsonML';
import { toElement } from './elements/Elements';
import EllipsisElement from './elements/EllipsisElement';

/* tslint:disable */
declare global {
    interface Window {
        devtoolsFormatters: any;
    }
}
/* tslint:enable*/

export default class JsonMLFormatter
    implements T.IFormatter, T.IJsonMLFormatter, T.IDevToolsFormatter {

    public theme:T.ITheme;

    constructor(theme: T.ITheme) {
        window.devtoolsFormatters = [this];
        this.theme = theme;
    }

    public format(obj: T.IElmDebugValue): any {
        return obj;
    }

    public header(obj: T.IElmDebugValue, config: T.IConfig): any[] | null {
        if (!!config && config.elmFormat) {
            return new JsonML('div')
                .withChild(config.key)
                .withChild(this.handleHeader(obj, config))
                .toJSONML();
        }
        if (!!obj.type && obj.type === 'ElmDebug') {
            return new JsonML('div')
                .withChild(this.handleHeader(obj))
                .toJSONML();
        } else {
            return null;
        }
    }

    public hasBody(obj: T.IElmDebugValue, config: T.IConfig): boolean {
        const element = toElement(obj, this);
        return (
            element !== null &&
            element.body !== undefined &&
            element.body() !== null
        );
    }

    public body(obj: T.IElmDebugValue, config: T.IConfig): any[] | null {
        if (this.handleBody(obj) === null) {
            return null;
        }

        return this.handleBody(obj).toJSONML();
    }

    public handleHeader(
        obj: T.ElmDebugValueType,
        config: T.IConfig = { elmFormat: true, level: 0 }
    ): JsonML {
        const newConfig = _.clone(config);
        const element = toElement(obj, this);

        newConfig.level = config.level + 1;

        if (element) {
            return element.header(newConfig);
        } else {
            return new JsonML('span').withText('UNPARSED: ').withText(obj);
        }
    }

    public handleBody(
        obj: T.ElmDebugValueType,
        config?: T.IConfig
    ): JsonML | null {
        const element = toElement(obj, this);
        if (element !== undefined) {
            return element.body !== undefined ? element.body(config) : null;
        } else {
            return new JsonML('div').withText('UNPARSED body: ').withText(obj);
        }
    }
}

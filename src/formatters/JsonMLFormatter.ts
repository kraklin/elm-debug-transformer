import * as _ from 'lodash';
import * as T from '../CommonTypes';
import JsonML from '../JsonML';
import { toElement } from './elements/Elements';

/* tslint:disable */
declare global {
    interface Window {
        devtoolsFormatters: any;
    }
}
/* tslint:enable*/

export default class JsonMLFormatter
    implements T.IFormatter, T.IJsonMLFormatter {
    constructor() {
        window.devtoolsFormatters = [this];
    }

    public format(obj: T.IElmDebugValue): any {
        return obj;
    }

    public header(obj: T.IElmDebugValue, config: T.IConfig) {
        if (!!obj.type && obj.type === 'ElmDebug') {
            return new JsonML('div')
                .withChild(this.handleHeader(obj))
                .toJSONML();
        } else {
            return null;
        }
    }
    public hasBody(obj: any) {
        return false;
    }
    public body(obj: any, config: T.IConfig) {
        return;
    }

    public handleHeader(obj: T.ElmDebugValueType): JsonML {
        if (T.isElmValue(obj) && obj.type === 'ElmDebug') {
            return new JsonML('div')
                .withChild(new JsonML('span').withText(obj.name + ': '))
                .withChild(this.handleHeader(obj.value));
        }

        const element = toElement(obj, this);
        if (element) {
            return element.header();
        } else {
            return new JsonML('span').withText('UNPARSED: ').withText(obj);
        }
    }
}

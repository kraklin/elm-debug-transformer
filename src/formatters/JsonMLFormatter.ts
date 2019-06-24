import * as _ from 'lodash';
import * as T from '../CommonTypes';
import JsonML from '../JsonML';
import BooleanElement from './elements/BooleanElement';
import CustomTypeElement from './elements/CustomTypeElement';
import DictElement from './elements/DictElement';
import ListElement from './elements/ListElement';
import NumberElement from './elements/NumberElement';
import RecordElement from './elements/RecordElement';
import StringElement from './elements/StringElement';
import TupleElement from './elements/TupleElement';
import TypeElement from './elements/TypeElement';

/* tslint:disable */
declare global {
    interface Window {
        devtoolsFormatters: any;
    }
}
/* tslint:enable*/

export default class DevToolsFormatter
    implements T.IFormatter, T.IJsonMLFormatter {
    constructor() {
        window.devtoolsFormatters = [this];
    }

    public format(obj: T.IElmDebugValue): any {
        return obj;
    }

    public header(obj: T.IElmDebugValue, config: T.IConfig) {
        if (
            (!!obj.type && obj.type === 'ElmDebug') ||
            (!!config && config.elmFormat)
        ) {
            if (config !== undefined) {
                return this.renderLine(
                    config.key,
                    this.handleHeader(obj),
                    10
                ).toJSONML();
            } else {
                return new JsonML('div')
                    .withChild(this.handleHeader(obj))
                    .toJSONML();
            }
        } else {
            return null;
        }
    }
    public hasBody(obj: any) {
        return false;
    }
    public body(obj: any, config: T.IConfig) {
        return;
        // return this.formatter.handleBody(obj, config).toJSONML();
    }

    public renderLine(key: string, value: JsonML, margin: number): JsonML {
        const keyStyle = 'color: purple; font-weight: bold';

        if (!margin) {
            margin = 0;
        }
        const keyJsonML = new JsonML('span').withStyle(keyStyle).withText(key);

        return new JsonML('div')
            .withStyle(`margin-left: ${margin}px`)
            .withChild(keyJsonML)
            .withChild(value);
    }

    public handleHeader(obj: T.ElmDebugValueType, config?: T.IConfig): JsonML {
        if (T.isElmValue(obj) && obj.type === 'ElmDebug') {
            return new JsonML('div')
                .withChild(new JsonML('span').withText(obj.name + ': '))
                .withChild(this.handleHeader(obj.value));
        }

        if (this.toElement(obj)) {
            return this.toElement(obj).header();
        } else {
            return new JsonML('span').withText(obj);
        }
    }

    private toElement(obj: T.ElmDebugValueType): T.IFormatterElement {
        if (typeof obj === 'string') {
            return new StringElement(obj);
        } else if (typeof obj === 'boolean') {
            return new BooleanElement(obj);
        } else if (T.isElmNumberType(obj)) {
            return new NumberElement(obj);
        } else if (T.isElmTypeValue(obj)) {
            return new TypeElement(obj);
        } else if (T.isElmCustomValue(obj)) {
            return new CustomTypeElement(obj, this);
        } else if (T.isElmDictValue(obj)) {
            return new DictElement(obj);
        } else if (T.isElmListValue(obj)) {
            return obj.type === 'Tuple'
                ? new TupleElement(obj, this)
                : new ListElement(obj);
        } else if (T.isElmRecordValue(obj)) {
            return new RecordElement(obj, this);
        }
    }
}

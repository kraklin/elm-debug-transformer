import { defaults, mapValues } from 'lodash';
import * as T from '../CommonTypes';

export default class SimpleFormatter implements T.IFormatter {
    public format(obj: T.IElmDebugValue): object {
        return { [obj.name]: this.formatValue(obj.value) };
    }

    public formatArray(array: T.ElmDebugValueType[]): object[] {
        return array.map(v => this.formatValue(v));
    }

    public formatCustom(
        custom: T.IElmDebugCustomValue
    ): { [key: string]: any } {
        return {
            [custom.name]:
                custom.value.length === 1
                    ? this.formatValue(custom.value[0])
                    : this.formatArray(custom.value),
        };
    }

    public formatValue(formatee: T.ElmDebugValueType): any {
        if (
            typeof formatee === 'string' ||
            typeof formatee === 'number' ||
            typeof formatee === 'boolean'
        ) {
            return formatee;
        }

        if (T.isElmCustomValue(formatee)) {
            return this.formatCustom(formatee);
        }

        if (T.isElmRecordValue(formatee)) {
            return mapValues(formatee.value, v => this.formatValue(v));
        }

        if (T.isElmListValue(formatee)) {
            return this.formatArray(formatee.value);
        }

        if (T.isElmDictValue(formatee)) {
            return formatee.value.reduce(
                (result, dictItem: { [k: string]: any }) => {
                    return defaults(
                        {
                            [this.formatValue(dictItem.key)]: this.formatValue(
                                dictItem.value
                            ),
                        },
                        result
                    );
                },
                {}
            );
        }

        if (T.isElmTypeValue(formatee)) {
            return formatee.name;
        }

        switch (formatee.type) {
            case 'Function':
                return '<function>';

            case 'Internals':
                return '<internals>';

            case 'Bytes':
                return formatee.value + ' B';

            case 'Unit':
                return '()';

            default:
                return formatee.value !== undefined
                    ? this.formatValue(formatee.value)
                    : formatee;
        }
    }
}

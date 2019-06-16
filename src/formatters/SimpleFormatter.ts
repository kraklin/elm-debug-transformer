import {
    ElmDebugDictValues,
    ElmDebugValue,
    ElmDebugValueType,
    ElmDebugCustomValue,
    isElmValue,
    IFormatter,
} from '../CommonTypes';
import * as _ from 'lodash';

export default class SimpleFormatter implements IFormatter {
    public format(obj: ElmDebugValue): object {
        return { [obj.name]: this.formatValue(obj.value) };
    }

    formatArray(array: ElmDebugValueType[]): object[] {
        return array.map(v => this.formatValue(v));
    }

    formatCustom(custom: ElmDebugCustomValue): { [key: string]: any } {
        return {
            [custom.name]:
                custom.value.length === 1
                    ? this.formatValue(custom.value[0])
                    : this.formatArray(custom.value),
        };
    }

    formatValue(formatee: ElmDebugValueType): any {
        if (!isElmValue(formatee)) {
            return formatee;
        }

        switch (formatee.type) {
            case 'Record':
                return _.mapValues(<ElmDebugValue>formatee.value, v =>
                    this.formatValue(v)
                );

            case 'List':
            case 'Set':
            case 'Array':
            case 'Tuple':
                return this.formatArray(<ElmDebugValue[]>formatee.value);

            case 'Dict':
                return (<ElmDebugDictValues>formatee.value).reduce(
                    (result, dictItem: { [k: string]: any }) => {
                        return _.defaults(
                            {
                                [this.formatValue(
                                    dictItem.key
                                )]: this.formatValue(dictItem.value),
                            },
                            result
                        );
                    },
                    {}
                );

            case 'Type':
                return formatee.name;

            case 'Function':
                return '<function>';

            case 'Internals':
                return '<internals>';

            case 'Bytes':
                return formatee.value + ' B';

            case 'Custom':
                return this.formatCustom(<ElmDebugCustomValue>formatee);

            default:
                return formatee.value !== undefined
                    ? this.formatValue(formatee.value)
                    : formatee;
        }
    }
}

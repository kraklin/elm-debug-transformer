import { ElmDebug, IFormatter } from '../CommonTypes';
import * as _ from 'lodash';

export default class SimpleFormatter implements IFormatter {
    public format(obj: ElmDebug): any {
        return this.formatValue(obj.value);
    }

    toKey(key: any): string {
        return this.formatValue(key);
    }

    formatArray(array: any[]): any[] {
        return array.map(v => this.formatValue(v));
    }

    formatCustom(custom: {
        name: string;
        value: any[];
    }): { [key: string]: any } {
        return {
            [custom.name]:
                custom.value.length === 1
                    ? this.formatValue(custom.value[0])
                    : this.formatArray(custom.value),
        };
    }

    formatValue(formatee: any): any {
        if (formatee.type === undefined) {
            return formatee;
        }

        switch (formatee.type) {
            case 'Record':
                return _.mapValues(formatee.value, v => this.formatValue(v));

            case 'List':
            case 'Set':
            case 'Array':
            case 'Tuple':
                return this.formatArray(formatee.value);

            case 'Dict':
                return formatee.value.reduce(
                    (result, dictItem: { [k: string]: any }) => {
                        return _.defaults(
                            {
                                [this.toKey(dictItem.key)]: this.formatValue(
                                    dictItem.value
                                ),
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

            case 'Custom':
                return this.formatCustom(formatee);

            default:
                return formatee.value !== undefined
                    ? this.formatValue(formatee.value)
                    : formatee;
        }
    }
}

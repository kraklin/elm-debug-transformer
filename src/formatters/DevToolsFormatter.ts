import { ElmDebugValue, IFormatter } from '../CommonTypes';
import * as _ from 'lodash';

declare global {
    interface Window {
        devtoolsFormatters: any;
    }
}

export default class DevToolsFormatter implements IFormatter {
    constructor() {
        window.devtoolsFormatters = [this];
    }

    public format(obj: ElmDebugValue): any {
        return obj;
    }

    header(obj: ElmDebugValue, config) {
        if (
            (!!obj.type && obj.type === 'ElmDebug') ||
            (!!config && config.elmFormat)
        ) {
            if (!_.isNil(config) && !_.isNil(config.key)) {
                return this.keyValueLine(
                    config.key,
                    this.handleHeader(obj),
                    10
                );
            } else {
                return ['div', {}, this.handleHeader(obj)];
            }
        } else {
            return null;
        }
    }
    hasBody(obj) {
        return true;
    }
    body(obj, config) {
        return ['div', {}, this.handleBody(obj, config)];
    }

    keyValueLine(key, value, margin) {
        if (!margin) margin = 0;

        return [
            'div',
            { style: `margin-left: ${margin}px` },
            ['span', { style: `color: purple; font-weight: bold` }, key],
            ['span', {}, ' = '],
            value,
        ];
    }

    isFinalValue(value) {
        return (
            _.isString(value) ||
            _.isBoolean(value) ||
            value.type === 'Type' ||
            value.type === 'Unit' ||
            value.type === 'Number' ||
            value.type === 'Function'
        );
    }

    getFinalValue(value) {
        if (_.isString(value)) return `"${value}"`;
        else if (_.isBoolean(value)) return value ? 'True' : 'False';
        else if (value.type === 'Type') return value.name;
        else if (value.type === 'Unit') return '()';
        else if (value.type === 'Function') return '<function>';
        else if (value.type === 'Internals') return '<internals>';
        else return value.value;
    }

    indentValue(level) {
        return 10 * level;
    }

    handleHeader(value) {
        if (!value.type || !value.value) {
            if (this.isFinalValue(value)) return this.getFinalValue(value);
            else return null;
        }

        switch (value.type) {
            case 'ElmDebug':
                const tag = !!value.name ? value.name + ': ' : '';
                return tag + this.handleHeader(value.value);
            case 'Record':
                const keys = _.chain(value.value)
                    .mapValues((v, k) => {
                        return k + ' = ' + this.handleHeader(v);
                    })
                    .values()
                    .value();

                return `{ ${_.truncate(keys.join(', '))} }`;

            case 'Tuple':
                const tupleValues = value.value.map(v => {
                    return this.handleHeader(v);
                });

                return `( ${tupleValues.join(', ')} )`;

            case 'Custom':
                const typeValues = value.value.map(v => {
                    return this.handleHeader(v);
                });
                if (typeValues.length === 0) return value.name;
                else return `${value.name} ${typeValues.join(' ')}`;

            case 'Array':
                return `Array(${value.value.length})`;

            case 'Set':
                return `Set(${value.value.length})`;

            case 'Dict':
                return `Dict(${value.value.length})`;

            case 'List':
                if (value.value.length === 0) return '[]';
                else return `List(${value.value.length})`;

            case 'Number':
                return this.getFinalValue(value);

            default:
                return JSON.stringify(value);
        }
    }

    listBody(value, level) {
        const listValues = value.map((v, i) => {
            if (this.isFinalValue(v)) {
                return this.keyValueLine(i, this.getFinalValue(v), 34);
            }

            return [
                'div',
                { style: `margin-left:10px` },
                [
                    'object',
                    {
                        object: v,
                        config: { elmFormat: true, key: i, level: level },
                    },
                ],
            ];
        });

        return ['div', {}].concat(listValues);
    }

    handleBody(value, config) {
        const level = !config || !config.level ? 1 : config.level + 1;

        if (!value.type || !value.value) {
            return ['div', {}];
        }

        switch (value.type) {
            case 'ElmDebug':
                return ['div', {}, this.handleBody(value.value, {})];
            case 'Record':
                const values = _.chain(value.value)
                    .mapValues((v, k) => {
                        if (this.isFinalValue(v)) {
                            return this.keyValueLine(
                                k,
                                this.getFinalValue(v),
                                34
                            );
                        }
                        return [
                            'div',
                            { style: `margin-left:10px` },
                            [
                                'object',
                                {
                                    object: v,
                                    config: {
                                        elmFormat: true,
                                        key: k,
                                        level: level,
                                    },
                                },
                            ],
                        ];
                    })
                    .values()
                    .value();

                return ['div', {}].concat(values);

            case 'Array':
            case 'Set':
            case 'Tuple':
                return this.listBody(value.value, level);

            case 'List':
                if (value.value.length === 0) return null;
                else return this.listBody(value.value, level);

            case 'Dict':
                const dictValues = value.value.map(item => {
                    let key = this.isFinalValue(item.key)
                        ? this.getFinalValue(item.key)
                        : this.handleHeader(item.key);
                    if (this.isFinalValue(item.value)) {
                        return this.keyValueLine(
                            key,
                            this.getFinalValue(item.value),
                            34
                        );
                    }

                    return [
                        'div',
                        { style: `margin-left:10px` },
                        [
                            'object',
                            {
                                object: item.value,
                                config: {
                                    elmFormat: true,
                                    key: key,
                                    level: level,
                                },
                            },
                        ],
                    ];
                });
                return ['div', {}].concat(dictValues);

            case 'Custom':
                if (value.value.length === 0) {
                    return null;
                }

                return this.listBody(value.value, level);

            default:
                return ['div', {}, JSON.stringify({ v: value, c: config })];
        }

        return ['div', {}, 'body'];
    }
}

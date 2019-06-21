import * as _ from 'lodash';
import * as T from '../CommonTypes';
import JsonML from '../JsonML';

const keyStyle = 'color: purple; font-weight: bold';

interface IFormatterElement {
    header(): JsonML;
}

class StringElement implements IFormatterElement {
    private elmObj: string;
    private style = 'color: blue';

    constructor(obj: string) {
        this.elmObj = obj;
    }

    public header() {
        return new JsonML('span')
            .withStyle(this.style)
            .withText(`"${this.elmObj}"`);
    }
}

class BooleanElement implements IFormatterElement {
    private elmObj: boolean;
    private style = 'color: blue';

    constructor(obj: boolean) {
        this.elmObj = obj;
    }

    public header() {
        return new JsonML('span')
            .withStyle(this.style)
            .withText(this.elmObj ? 'True' : 'False');
    }
}

class NumberElement implements IFormatterElement {
    private elmObj: T.IElmDebugNumberValue;
    private numberStyle = 'color: purple';

    constructor(obj: T.IElmDebugNumberValue) {
        this.elmObj = obj;
    }

    public header() {
        return new JsonML('span')
            .withStyle(this.numberStyle)
            .withText(this.elmObj.value);
    }
}

class ListElement implements IFormatterElement {
    private elmObj: T.IElmDebugListValue;
    private arrayNameStyle = 'color: darkgreen';
    private emptyArrayStyle = 'color: grey';

    constructor(obj: T.IElmDebugListValue) {
        this.elmObj = obj;
    }

    public header() {
        if (this.elmObj.value.length === 0) {
            return new JsonML('span')
                .withStyle(this.emptyArrayStyle)
                .withText('[]');
        }
        return new JsonML('span')
            .withStyle(this.arrayNameStyle)
            .withText(this.elmObj.type)
            .withChild(
                new JsonML('span').withText(`(${this.elmObj.value.length})`)
            );
    }
}

class TupleElement implements IFormatterElement {
    private elmObj: T.IElmDebugListValue;
    private formatter: T.IChromeConsoleFormatter;

    constructor(
        obj: T.IElmDebugListValue,
        formatter: T.IChromeConsoleFormatter
    ) {
        this.elmObj = obj;
        this.formatter = formatter;
    }

    public header() {
        const tuple = new JsonML('span').withText('( ');
        const children = this.elmObj.value
            .map(child => this.formatter.handleHeader(child))
            .reduce((acc, child) => {
                acc.push(new JsonML('span').withText(', '));
                acc.push(child);
                return acc;
            }, []);

        children.splice(0, 1);

        return new JsonML('span')
            .withText('( ')
            .withChildren(children)
            .withText(' )');
    }
}

export default class ChromeConsoleFormatter
    implements T.IChromeConsoleFormatter {
    public renderLine(key: string, value: JsonML, margin: number): JsonML {
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

        return this.toElement(obj).header() || new JsonML('span').withText(obj);
    }

    private toElement(obj: T.ElmDebugValueType): IFormatterElement {
        if (typeof obj === 'string') {
            return new StringElement(obj);
        } else if (typeof obj === 'boolean') {
            return new BooleanElement(obj);
        } else if (T.isElmNumberType(obj)) {
            return new NumberElement(obj);
        } else if (T.isElmListValue(obj)) {
            return obj.type === 'Tuple'
                ? new TupleElement(obj, this)
                : new ListElement(obj);
        }
    }
}

/*
export default class ChromeConsoleFormatter
    implements T.IChromeConsoleFormatter {
    public renderLine(key: string, value: JsonML, margin: number): JsonML {
        if (!margin) {
            margin = 0;
        }
        const keyJsonML = new JsonML('span')
            .setStyle('color: purple; font-weight: bold')
            .createTextChild(key);

        return new JsonML('div')
            .setStyle(`margin-left: ${margin}px`)
            .appendChild(keyJsonML)
            .appendChild(value);
    }

    public isFinalValue(value: T.ElmDebugValueType) {
        return (
            _.isString(value) ||
            _.isBoolean(value) ||
            _.isNumber(value) ||
            value.type === 'Type' ||
            value.type === 'Unit' ||
            value.type === 'Number' ||
            value.type === 'Function'
        );
    }

    public getFinalValue(value: T.ElmDebugValueType): JsonML {
        const jsonML = new JsonML('span').setStyle('color: blue;');

        if (_.isString(value)) {
            return jsonML.createTextChild(value);
        } else if (_.isNumber(value)) {
            return jsonML.createTextChild(value);
        } else if (_.isBoolean(value)) {
            return jsonML.createTextChild(value ? 'True' : 'False');
        } else if (value.type === 'Unit') {
            return jsonML.createTextChild('()');
        } else if (value.type === 'Function') {
            return jsonML.createTextChild('<function>');
        } else if (value.type === 'Internals') {
            return jsonML.createTextChild('<internals>');
        } else if (value.type === 'Number') {
            return jsonML.createTextChild(
                (value as T.IElmDebugNumberValue).value.toString()
            );
        } else if (T.isElmTypeValue(value)) {
            return jsonML.createTextChild(value.name);
        } else {
            return jsonML.createTextChild((value as any).value.toString());
        }
    }

    public handleHeader(value: T.ElmDebugValueType): any {
        if (
            (value as T.IElmDebugValue).type === undefined ||
            (value as T.IElmDebugValue).value === undefined ||
            _.isString(value) ||
            _.isNumber(value) ||
            _.isBoolean(value)
        ) {
            if (this.isFinalValue(value)) {
                return this.getFinalValue(value);
            } else {
                return null;
            }
        }

        switch (value.type) {
            case 'ElmDebug':
                const typedValue = value as T.IElmDebugValue;
                const tag = !!typedValue.name ? typedValue.name + ': ' : '';

                return tag + this.handleHeader(typedValue.value);
            case 'Record':
                const keys: any[] = _.chain(
                    (value as T.IElmDebugRecordValue).value
                )
                    .mapValues((v, k) => {
                        return k + ' = ' + this.handleHeader(v);
                    })
                    .values()
                    .value();

                return `{ ${_.truncate(keys.join(', '))} }`;

            case 'Tuple':
                const tupleValues = (value as T.IElmDebugListValue).value.map(
                    (v: any) => {
                        return this.handleHeader(v);
                    }
                );

                return `( ${tupleValues.join(', ')} )`;

            case 'Custom':
                const customValue = value as T.IElmDebugCustomValue;
                const typeValues = customValue.value.map((v: any) => {
                    return this.handleHeader(v);
                });
                if (typeValues.length === 0) {
                    return customValue.name;
                } else {
                    return `${customValue.name} ${typeValues.join(' ')}`;
                }

            case 'Array':
                return `Array(${(value as T.IElmDebugListValue).value.length})`;

            case 'Set':
                return `Set(${(value as T.IElmDebugListValue).value.length})`;

            case 'Dict':
                return `Dict(${(value as T.IElmDebugDictValue).value.length})`;

            case 'List':
                if ((value as T.IElmDebugListValue).value.length === 0) {
                    return '[]';
                } else {
                    return `List(${
                        (value as T.IElmDebugListValue).value.length
                    })`;
                }

            case 'Number':
                return this.getFinalValue(value);

            default:
                return JSON.stringify(value);
        }
    }

    public listBody(value: T.ElmDebugValueType[], level: number) {
        const listValues = value.map((v: T.ElmDebugValueType, i: number) => {
            if (this.isFinalValue(v)) {
                return this.renderLine(i.toString(), this.getFinalValue(v), 34);
            }

            return [
                'div',
                { style: `margin-left:10px` },
                [
                    'object',
                    {
                        config: { elmFormat: true, key: i, level },
                        object: v,
                    },
                ],
            ];
        });

        return ['div', {}].concat(listValues);
    }

    public handleBody(value: any, config?: T.IConfig): any {
        const level = !config || !config.level ? 1 : config.level + 1;

        if (!value.type || !value.value) {
            return ['div', {}];
        }

        switch (value.type) {
            case 'ElmDebug':
                return ['div', {}, this.handleBody(value.value, null)];
            case 'Record':
                const values = _.chain(value.value)
                    .mapValues((v, k) => {
                        if (this.isFinalValue(v)) {
                            return this.renderLine(
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
                                    config: {
                                        elmFormat: true,
                                        key: k,
                                        level,
                                    },
                                    object: v,
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
                if (value.value.length === 0) {
                    return null;
                } else {
                    return this.listBody(value.value, level);
                }

            case 'Dict':
                const dictValues = value.value.map(
                    (item: { key: any; value: any }) => {
                        const key = this.isFinalValue(item.key)
                            ? this.getFinalValue(item.key)
                            : this.handleHeader(item.key);
                        if (this.isFinalValue(item.value)) {
                            return this.renderLine(
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
                                    config: {
                                        elmFormat: true,
                                        key,
                                        level,
                                    },
                                    object: item.value,
                                },
                            ],
                        ];
                    }
                );
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
}*/

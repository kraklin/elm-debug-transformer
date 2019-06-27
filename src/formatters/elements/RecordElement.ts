import {
    IElmDebugRecordValue,
    IFormatterElement,
    IJsonMLFormatter,
} from '../../CommonTypes';
import JsonML from '../../JsonML';
import EllipsisElement from './EllipsisElement';
import { KeyElementStyle } from './Styles';

export default class RecordElement implements IFormatterElement {
    private elmObj: IElmDebugRecordValue;
    private formatter: IJsonMLFormatter;

    constructor(obj: IElmDebugRecordValue, formatter: IJsonMLFormatter) {
        this.elmObj = obj;
        this.formatter = formatter;
    }

    public header() {
        const keys = Object.keys(this.elmObj.value);
        const children = keys
            .map(k => {
                return new JsonML('span')
                    .withStyle(KeyElementStyle)
                    .withText(k + ': ')
                    .withChild(
                        this.formatter.handleHeader(this.elmObj.value[k])
                    );
            })
            .reduce(
                (accObj, child) => {
                    const lengthWithChild = accObj.size + child.toStr().length;
                    if (accObj.hasEllipsis) {
                        return accObj;
                    }

                    if (lengthWithChild < 50) {
                        accObj.acc.push(child);
                        accObj.size = lengthWithChild;
                    } else {
                        accObj.acc.push(new EllipsisElement().header());
                        accObj.hasEllipsis = true;
                    }

                    return accObj;
                },
                { acc: [], size: 0, hasEllipsis: false }
            )
            .acc.reduce((acc, child) => {
                acc.push(new JsonML('span').withText(', '));
                acc.push(child);
                return acc;
            }, []);

        children.splice(0, 1);

        return new JsonML('span')
            .withText('{ ')
            .withChildren(children)
            .withText(' }');
    }

    public body() {
        const keys = Object.keys(this.elmObj.value);
        const objects = keys.map(k => {
            const keyElement = new JsonML('span')
                .withStyle(KeyElementStyle)
                .withText(k)
                .withText(': ');
            if (this.formatter.handleBody(this.elmObj.value[k]) === null) {
                keyElement.withStyle('margin-left: 13px;');
            }

            return new JsonML('div').withObject(
                keyElement,
                this.elmObj.value[k]
            );
        });

        return new JsonML('div')
            .withStyle('margin-left: 15px;')
            .withChildren(objects);
    }
}

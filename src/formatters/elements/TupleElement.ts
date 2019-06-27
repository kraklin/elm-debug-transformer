import {
    IElmDebugListValue,
    IFormatterElement,
    IJsonMLFormatter,
} from '../../CommonTypes';
import JsonML from '../../JsonML';
import { KeyElementStyle } from './Styles';

export default class TupleElement implements IFormatterElement {
    private elmObj: IElmDebugListValue;
    private formatter: IJsonMLFormatter;

    constructor(obj: IElmDebugListValue, formatter: IJsonMLFormatter) {
        this.elmObj = obj;
        this.formatter = formatter;
    }

    public header() {
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

    public body(): JsonML | null {
        if (this.elmObj.value.length <= 1) {
            return null;
        }

        const children = this.elmObj.value.map((child, index) => {
            const names = ['1st', '2nd', '3rd'];
            const element = new JsonML('span')
                .withChild(
                    new JsonML('span')
                        .withStyle(KeyElementStyle)
                        .withText(`${names[index]}`)
                )
                .withText(': ');

            if (this.formatter.handleBody(child) === null) {
                element.withStyle('margin-left: 13px;');
            }

            return new JsonML('div').withObject(element, child);
        });

        return new JsonML('div')
            .withStyle('margin-left: 15px;')
            .withChildren(children);
    }
}

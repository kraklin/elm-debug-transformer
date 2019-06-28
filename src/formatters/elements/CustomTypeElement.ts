import {
    IElmDebugCustomValue,
    IFormatterElement,
    IJsonMLFormatter,
} from '../../CommonTypes';
import JsonML from '../../JsonML';
import EllipsisElement from './EllipsisElement';
import { CustomTypeNameStyle, KeyElementStyle } from './Styles';

export default class CustomTypeElement implements IFormatterElement {
    private elmObj: IElmDebugCustomValue;
    private formatter: IJsonMLFormatter;

    constructor(obj: IElmDebugCustomValue, formatter: IJsonMLFormatter) {
        this.elmObj = obj;
        this.formatter = formatter;
    }

    public header() {
        if (this.elmObj.value.length === 0) {
            return new JsonML('span')
                .withStyle(CustomTypeNameStyle)
                .withText(this.elmObj.name);
        }
        if (this.elmObj.value.length === 1) {
            return new JsonML('span')
                .withStyle(CustomTypeNameStyle)
                .withText(this.elmObj.name + ' ')
                .withChild(this.formatter.handleHeader(this.elmObj.value[0]));
        } else {
            const children = this.elmObj.value
                .map(child => this.formatter.handleHeader(child))
                .reduce((acc, child) => {
                    acc.push(new JsonML('span').withText('( '));
                    acc.push(child);
                    acc.push(new JsonML('span').withText(' )'));
                    return acc;
                }, []);

            return new JsonML('span')
                .withStyle(CustomTypeNameStyle)
                .withText(this.elmObj.name + ' ')
                .withChildren(children);
            // .withChild(new EllipsisElement().header());
        }
    }

    public body(): JsonML | null {
        if (
            this.elmObj.value.length === 1 &&
            this.formatter.handleBody(this.elmObj.value[0]) === null
        ) {
            return null;
        }

        const children = this.elmObj.value.map((child, index) => {
            const element = new JsonML('span')
                .withChild(
                    new JsonML('span')
                        .withStyle(KeyElementStyle)
                        .withText(`${index}`)
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

import {
    IConfig,
    IElmDebugListValue,
    IFormatterElement,
    IJsonMLFormatter,
} from '../../CommonTypes';
import JsonML from '../../JsonML';
import EllipsisElement from './EllipsisElement';
import { ExpandableBorderStyle } from './Styles';

export default class TupleElement implements IFormatterElement {
    private elmObj: IElmDebugListValue;
    private formatter: IJsonMLFormatter;

    constructor(obj: IElmDebugListValue, formatter: IJsonMLFormatter) {
        this.elmObj = obj;
        this.formatter = formatter;
    }

    public header(config?: IConfig) {
        if (!!config && config.level > 1) {
            return new JsonML('span')
                .withText('( ')
                .withChild(
                    this.formatter.handleHeader(this.elmObj.value[0], config)
                )
                .withChild(new JsonML('span').withText(', '))
                .withChild(new EllipsisElement().header())
                .withText(' )');
        }
        const children = this.elmObj.value
            .map(child => this.formatter.handleHeader(child, config))
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

    public body(config?: IConfig): JsonML | null {
        if (this.elmObj.value.length <= 1) {
            return null;
        }

        const children = this.elmObj.value.map((child, index) => {
            const element = new JsonML('span')
                .withChild(
                    new JsonML('span')
                        .withStyle(this.formatter.theme.keyElementStyle)
                        .withText(`${index}`)
                )
                .withText(': ');

            if (this.formatter.handleBody(child, config) === null) {
                element.withStyle('margin-left: 13px;');
            }

            return new JsonML('div').withObject(element, child);
        });

        return new JsonML('div')
            .withStyle(ExpandableBorderStyle)
            .withChildren(children);
    }
}

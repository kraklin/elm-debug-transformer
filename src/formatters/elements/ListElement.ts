import {
    IConfig,
    IElmDebugListValue,
    IFormatterElement,
    IJsonMLFormatter,
} from '../../CommonTypes';
import JsonML from '../../JsonML';

export default class ListElement implements IFormatterElement {
    private elmObj: IElmDebugListValue;
    private formatter: IJsonMLFormatter;

    constructor(obj: IElmDebugListValue, formatter: IJsonMLFormatter) {
        this.elmObj = obj;
        this.formatter = formatter;
    }

    public header = (config?: IConfig) => {
        if (this.elmObj.value.length === 0) {
            return new JsonML('span').withStyle(this.formatter.theme.greyedStyle).withText('[]');
        }
        if (this.elmObj.value.length === 1) {
            return new JsonML('span')
                .withStyle(this.formatter.theme.greyedStyle)
                .withText('[')
                .withChild(
                    new JsonML('span').withChild(
                        this.formatter.handleHeader(
                            this.elmObj.value[0],
                            config
                        )
                    )
                )
                .withText(']');
        }
        return new JsonML('span')
            .withStyle(this.formatter.theme.dataStructureNameStyle)
            .withText(this.elmObj.type)
            .withChild(
                new JsonML('span').withText(`(${this.elmObj.value.length})`)
            );
    }

    public body = (config?: IConfig): JsonML | null => {
        if (this.elmObj.value.length === 0) {
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
                element.withStyle('margin-left: 13px');
            }

            return new JsonML('div').withObject(element, child);
        });

        return new JsonML('div')
            .withStyle(this.formatter.theme.expandableBorderStyle)
            .withChildren(children);
    }
}

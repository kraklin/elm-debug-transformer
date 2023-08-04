import {
    IConfig,
    IElmDebugDictValue,
    IFormatterElement,
    IJsonMLFormatter,
} from '../../CommonTypes';
import JsonML from '../../JsonML';

export default class DictElement implements IFormatterElement {
    private elmObj: IElmDebugDictValue;
    private formatter: IJsonMLFormatter;

    constructor(obj: IElmDebugDictValue, formatter: IJsonMLFormatter) {
        this.elmObj = obj;
        this.formatter = formatter;
    }

    public header = () => {
        if (this.elmObj.value.length === 0) {
            return new JsonML('span')
                .withStyle(this.formatter.theme.greyedStyle)
                .withText('Dict.empty');
        }

        return new JsonML('span')
            .withStyle(this.formatter.theme.dataStructureNameStyle)
            .withText('Dict')
            .withChild(
                new JsonML('span').withText(`(${this.elmObj.value.length})`)
            );
    }

    public body = (config?: IConfig) => {
        const children = this.elmObj.value.map(child => {
            const key = this.formatter.handleHeader(child.key, config);
            const element = new JsonML('span')
                .withChild(
                    new JsonML('span').withStyle(this.formatter.theme.keyElementStyle).withChild(key)
                )
                .withText(': ');

            if (this.formatter.handleBody(child.value, config) === null) {
                element.withStyle('margin-left: 13px;');
            }

            return new JsonML('div').withObject(element, child.value, config);
        });

        return new JsonML('div')
            .withStyle(this.formatter.theme.expandableBorderStyle)
            .withChildren(children);
    }
}

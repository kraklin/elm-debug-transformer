import {
    IElmDebugListValue,
    IFormatterElement,
    IJsonMLFormatter,
} from '../../CommonTypes';
import JsonML from '../../JsonML';
import {
    DataStructureNameStyle,
    GreyedOutStyle,
    KeyElementStyle,
} from './Styles';

export default class ListElement implements IFormatterElement {
    private elmObj: IElmDebugListValue;
    private formatter: IJsonMLFormatter;

    constructor(obj: IElmDebugListValue, formatter: IJsonMLFormatter) {
        this.elmObj = obj;
        this.formatter = formatter;
    }

    public header() {
        if (this.elmObj.value.length === 0) {
            return new JsonML('span').withStyle(GreyedOutStyle).withText('[]');
        }
        return new JsonML('span')
            .withStyle(DataStructureNameStyle)
            .withText(this.elmObj.type)
            .withChild(
                new JsonML('span').withText(`(${this.elmObj.value.length})`)
            );
    }

    public body(): JsonML | null {
        if (this.elmObj.value.length === 0) {
            return null;
        }

        const children = this.elmObj.value.map((child, index) => {
            const element = new JsonML('span')
                .withChild(
                    new JsonML('span')
                        .withStyle(KeyElementStyle)
                        .withText(`[${index}]`)
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

import {
    IConfig,
    IElmDebugDictValue,
    IFormatterElement,
    IJsonMLFormatter,
} from '../../CommonTypes';
import JsonML from '../../JsonML';
import {
    DataStructureNameStyle,
    GreyedOutStyle,
    KeyElementStyle,
} from './Styles';

export default class DictElement implements IFormatterElement {
    private elmObj: IElmDebugDictValue;
    private formatter: IJsonMLFormatter;

    constructor(obj: IElmDebugDictValue, formatter: IJsonMLFormatter) {
        this.elmObj = obj;
        this.formatter = formatter;
    }

    public header() {
        if (this.elmObj.value.length === 0) {
            return new JsonML('span')
                .withStyle(GreyedOutStyle)
                .withText('Dict.empty');
        }

        return new JsonML('span')
            .withStyle(DataStructureNameStyle)
            .withText('Dict')
            .withChild(
                new JsonML('span').withText(`(${this.elmObj.value.length})`)
            );
    }

    public body(config?: IConfig) {
        const children = this.elmObj.value.map(child => {
            const key = this.formatter.handleHeader(child.key, config);
            const element = new JsonML('span')
                .withChild(
                    new JsonML('span').withStyle(KeyElementStyle).withChild(key)
                )
                .withText(': ');

            if (this.formatter.handleBody(child.value, config) === null) {
                element.withStyle(
                    'padding-left: 13px; border-left: 1px solid black'
                );
            }

            return new JsonML('div').withObject(element, child.value, config);
        });

        return new JsonML('div')
            .withStyle('margin-left: 15px;')
            .withChildren(children);
    }
}

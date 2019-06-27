import {
    IElmDebugCustomValue,
    IFormatterElement,
    IJsonMLFormatter,
} from '../../CommonTypes';
import JsonML from '../../JsonML';
import EllipsisElement from './EllipsisElement';
import { CustomTypeNameStyle } from './Styles';

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
            return new JsonML('span')
                .withStyle(CustomTypeNameStyle)
                .withText(this.elmObj.name + ' ')
                .withChild(new EllipsisElement().header());
        }
    }

    public body() {
        return new JsonML('div').withText('Not implemented yet');
    }
}

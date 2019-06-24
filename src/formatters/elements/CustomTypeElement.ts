import {
    IElmDebugCustomValue,
    IFormatterElement,
    IJsonMLFormatter,
} from '../../CommonTypes';
import JsonML from '../../JsonML';

export default class CustomTypeElement implements IFormatterElement {
    private elmObj: IElmDebugCustomValue;
    private formatter: IJsonMLFormatter;
    private style = 'color: darkgreen; font-weight: normal;';
    private ellipsisStyle = 'color: gray; font-weight: normal;';

    constructor(obj: IElmDebugCustomValue, formatter: IJsonMLFormatter) {
        this.elmObj = obj;
        this.formatter = formatter;
    }

    public header() {
        if (this.elmObj.value.length === 0) {
            return new JsonML('span')
                .withStyle(this.style)
                .withText(this.elmObj.name);
        }
        if (this.elmObj.value.length === 1) {
            return new JsonML('span')
                .withStyle(this.style)
                .withText(this.elmObj.name + ' ')
                .withChild(this.formatter.handleHeader(this.elmObj.value[0]));
        } else {
            const ellipsis = new JsonML('span')
                .withStyle(this.ellipsisStyle)
                .withText('…');

            return new JsonML('span')
                .withStyle(this.style)
                .withText(this.elmObj.name + ' ')
                .withChild(ellipsis);
        }
    }
}

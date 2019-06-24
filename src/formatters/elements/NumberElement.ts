import { IElmDebugNumberValue, IFormatterElement } from '../../CommonTypes';
import JsonML from '../../JsonML';

export default class NumberElement implements IFormatterElement {
    private elmObj: IElmDebugNumberValue;
    private numberStyle = 'color: purple; font-weight: normal;';

    constructor(obj: IElmDebugNumberValue) {
        this.elmObj = obj;
    }

    public header() {
        return new JsonML('span')
            .withStyle(this.numberStyle)
            .withText(this.elmObj.value);
    }

    public body() {
        return new JsonML('div').withText('Not implemented yet');
    }
}

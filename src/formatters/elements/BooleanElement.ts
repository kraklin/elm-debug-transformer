import { IElmDebugBoolValue, IFormatterElement } from '../../CommonTypes';
import JsonML from '../../JsonML';

export default class BooleanElement implements IFormatterElement {
    private elmObj: IElmDebugBoolValue;
    private style = 'color: blue; font-weight: normal;';

    constructor(obj: IElmDebugBoolValue) {
        this.elmObj = obj;
    }

    public header() {
        return new JsonML('span')
            .withStyle(this.style)
            .withText(this.elmObj.value ? 'True' : 'False');
    }
}

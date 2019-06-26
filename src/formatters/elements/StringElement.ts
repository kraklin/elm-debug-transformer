import { IElmDebugStringValue, IFormatterElement } from '../../CommonTypes';
import JsonML from '../../JsonML';

export default class StringElement implements IFormatterElement {
    private elmObj: IElmDebugStringValue;
    private style = 'color: blue; font-weight: normal;';

    constructor(obj: IElmDebugStringValue) {
        this.elmObj = obj;
    }

    public header() {
        return new JsonML('span')
            .withStyle(this.style)
            .withText(`"${this.elmObj.value}"`);
    }
}

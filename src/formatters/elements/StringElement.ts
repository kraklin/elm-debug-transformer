import { IElmDebugStringValue, IFormatterElement } from '../../CommonTypes';
import JsonML from '../../JsonML';
import { StringStyle } from './Styles';

export default class StringElement implements IFormatterElement {
    private elmObj: IElmDebugStringValue;

    constructor(obj: IElmDebugStringValue) {
        this.elmObj = obj;
    }

    public header() {
        return new JsonML('span')
            .withStyle(StringStyle)
            .withText(`"${this.elmObj.value}"`);
    }
}

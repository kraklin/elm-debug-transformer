import { IElmDebugValue, IFormatterElement } from '../../CommonTypes';
import JsonML from '../../JsonML';
import { BytesStyle } from './Styles';

export default class BytesElement implements IFormatterElement {
    private elmObj: IElmDebugValue;

    constructor(obj: IElmDebugValue) {
        this.elmObj = obj;
    }

    public header() {
        return new JsonML('span')
            .withStyle(BytesStyle)
            .withText(this.elmObj.value + ' B');
    }
}

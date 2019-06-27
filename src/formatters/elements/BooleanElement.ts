import { IElmDebugBoolValue, IFormatterElement } from '../../CommonTypes';
import JsonML from '../../JsonML';
import { BooleanStyle } from './Styles';

export default class BooleanElement implements IFormatterElement {
    private elmObj: IElmDebugBoolValue;

    constructor(obj: IElmDebugBoolValue) {
        this.elmObj = obj;
    }

    public header() {
        return new JsonML('span')
            .withStyle(BooleanStyle)
            .withText(this.elmObj.value ? 'True' : 'False');
    }
}

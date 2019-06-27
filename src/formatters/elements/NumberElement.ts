import { IElmDebugNumberValue, IFormatterElement } from '../../CommonTypes';
import JsonML from '../../JsonML';
import { NumberStyle } from './Styles';

export default class NumberElement implements IFormatterElement {
    private elmObj: IElmDebugNumberValue;

    constructor(obj: IElmDebugNumberValue) {
        this.elmObj = obj;
    }

    public header() {
        return new JsonML('span')
            .withStyle(NumberStyle)
            .withText(this.elmObj.value);
    }
}

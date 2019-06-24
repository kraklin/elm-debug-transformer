import { IElmDebugTypeValueType, IFormatterElement } from '../../CommonTypes';
import JsonML from '../../JsonML';

export default class TypeElement implements IFormatterElement {
    private elmObj: IElmDebugTypeValueType;
    private style = 'color: darkgreen; font-weight: normal;';

    constructor(obj: IElmDebugTypeValueType) {
        this.elmObj = obj;
    }

    public header() {
        return new JsonML('span')
            .withStyle(this.style)
            .withText(this.elmObj.name);
    }
}

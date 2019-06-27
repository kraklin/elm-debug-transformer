import { IElmDebugTypeValueType, IFormatterElement } from '../../CommonTypes';
import JsonML from '../../JsonML';
import { TypeNameStyle } from './Styles';

export default class TypeElement implements IFormatterElement {
    private elmObj: IElmDebugTypeValueType;

    constructor(obj: IElmDebugTypeValueType) {
        this.elmObj = obj;
    }

    public header() {
        return new JsonML('span')
            .withStyle(TypeNameStyle)
            .withText(this.elmObj.name);
    }
}

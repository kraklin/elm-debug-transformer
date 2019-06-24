import { IElmDebugListValue, IFormatterElement } from '../../CommonTypes';
import JsonML from '../../JsonML';

export default class ListElement implements IFormatterElement {
    private elmObj: IElmDebugListValue;
    private arrayNameStyle = 'color: darkgreen; font-weight: normal;';
    private emptyArrayStyle = 'color: grey; font-weight: normal;';

    constructor(obj: IElmDebugListValue) {
        this.elmObj = obj;
    }

    public header() {
        if (this.elmObj.value.length === 0) {
            return new JsonML('span')
                .withStyle(this.emptyArrayStyle)
                .withText('[]');
        }
        return new JsonML('span')
            .withStyle(this.arrayNameStyle)
            .withText(this.elmObj.type)
            .withChild(
                new JsonML('span').withText(`(${this.elmObj.value.length})`)
            );
    }
}

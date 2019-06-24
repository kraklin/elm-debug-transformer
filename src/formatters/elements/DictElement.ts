import { IElmDebugDictValue, IFormatterElement } from '../../CommonTypes';
import JsonML from '../../JsonML';

export default class DictElement implements IFormatterElement {
    private elmObj: IElmDebugDictValue;
    private emptyStyle = 'color: grey; font-weight: normal;';
    private dictStyle = 'color: darkgreen; font-weight: normal;';

    constructor(obj: IElmDebugDictValue) {
        this.elmObj = obj;
    }

    public header() {
        if (this.elmObj.value.length === 0) {
            return new JsonML('span')
                .withStyle(this.emptyStyle)
                .withText('Dict.empty');
        }

        return new JsonML('span')
            .withStyle(this.dictStyle)
            .withText('Dict')
            .withChild(
                new JsonML('span').withText(`(${this.elmObj.value.length})`)
            );
    }
}

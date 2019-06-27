import { IElmDebugDictValue, IFormatterElement } from '../../CommonTypes';
import JsonML from '../../JsonML';
import { DataStructureNameStyle, GreyedOutStyle } from './Styles';

export default class DictElement implements IFormatterElement {
    private elmObj: IElmDebugDictValue;

    constructor(obj: IElmDebugDictValue) {
        this.elmObj = obj;
    }

    public header() {
        if (this.elmObj.value.length === 0) {
            return new JsonML('span')
                .withStyle(GreyedOutStyle)
                .withText('Dict.empty');
        }

        return new JsonML('span')
            .withStyle(DataStructureNameStyle)
            .withText('Dict')
            .withChild(
                new JsonML('span').withText(`(${this.elmObj.value.length})`)
            );
    }

    public body() {
        return new JsonML('div').withText('Not implemented yet');
    }
}

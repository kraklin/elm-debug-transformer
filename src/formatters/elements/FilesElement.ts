import { IElmDebugValue, IFormatterElement } from '../../CommonTypes';
import JsonML from '../../JsonML';

export default class FilesElement implements IFormatterElement {
    private elmObj: IElmDebugValue;
    private style = 'color: black; font-weight: normal;';

    constructor(obj: IElmDebugValue) {
        this.elmObj = obj;
    }

    public header() {
        return new JsonML('span')
            .withStyle(this.style)
            .withText(this.elmObj.value);
    }

    public body() {
        return new JsonML('div').withText('Not implemented yet');
    }
}

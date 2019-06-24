import {
    IElmDebugRecordValue,
    IFormatterElement,
    IJsonMLFormatter,
} from '../../CommonTypes';
import JsonML from '../../JsonML';

export default class EllipsisElement implements IFormatterElement {
    private ellipsisStyle = 'color: gray; font-weight: normal;';

    public header() {
        return new JsonML('span').withStyle(this.ellipsisStyle).withText('…');
    }

    public body() {
        return new JsonML('div').withText('Not implemented yet');
    }
}

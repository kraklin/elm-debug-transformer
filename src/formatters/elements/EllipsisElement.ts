import {
    IElmDebugRecordValue,
    IFormatterElement,
    IJsonMLFormatter,
} from '../../CommonTypes';
import JsonML from '../../JsonML';
import { GreyedOutStyle } from './Styles';

export default class EllipsisElement implements IFormatterElement {
    public header() {
        return new JsonML('span').withStyle(GreyedOutStyle).withText('…');
    }
}

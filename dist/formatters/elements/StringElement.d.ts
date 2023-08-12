import { IElmDebugStringValue, IFormatterElement, IJsonMLFormatter } from '../../CommonTypes';
import JsonML from '../../JsonML';
export default class StringElement implements IFormatterElement {
    private elmObj;
    private formatter;
    constructor(obj: IElmDebugStringValue, formatter: IJsonMLFormatter);
    header: () => JsonML;
}

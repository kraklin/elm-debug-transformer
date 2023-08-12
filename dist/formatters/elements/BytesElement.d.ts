import { IElmDebugValue, IFormatterElement, IJsonMLFormatter } from '../../CommonTypes';
import JsonML from '../../JsonML';
export default class BytesElement implements IFormatterElement {
    private elmObj;
    private formatter;
    constructor(obj: IElmDebugValue, formatter: IJsonMLFormatter);
    header: () => JsonML;
}

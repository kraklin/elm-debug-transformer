import { IElmDebugBoolValue, IFormatterElement, IJsonMLFormatter } from '../../CommonTypes';
import JsonML from '../../JsonML';
export default class BooleanElement implements IFormatterElement {
    private elmObj;
    private formatter;
    constructor(obj: IElmDebugBoolValue, formatter: IJsonMLFormatter);
    header: () => JsonML;
}

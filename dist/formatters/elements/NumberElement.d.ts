import { IElmDebugNumberValue, IFormatterElement, IJsonMLFormatter } from '../../CommonTypes';
import JsonML from '../../JsonML';
export default class NumberElement implements IFormatterElement {
    private elmObj;
    private formatter;
    constructor(obj: IElmDebugNumberValue, formatter: IJsonMLFormatter);
    header: () => JsonML;
}

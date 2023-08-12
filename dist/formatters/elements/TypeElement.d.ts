import { IElmDebugTypeValueType, IFormatterElement, IJsonMLFormatter } from '../../CommonTypes';
import JsonML from '../../JsonML';
export default class TypeElement implements IFormatterElement {
    private elmObj;
    private formatter;
    constructor(obj: IElmDebugTypeValueType, formatter: IJsonMLFormatter);
    header: () => JsonML;
}

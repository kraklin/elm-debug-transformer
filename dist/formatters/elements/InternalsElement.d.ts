import { IFormatterElement, IJsonMLFormatter } from '../../CommonTypes';
import JsonML from '../../JsonML';
export default class InternalsElement implements IFormatterElement {
    private elmObj;
    private formatter;
    constructor(obj: string, formatter: IJsonMLFormatter);
    header: () => JsonML;
}

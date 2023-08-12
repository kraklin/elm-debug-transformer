import { IConfig, IElmDebugListValue, IFormatterElement, IJsonMLFormatter } from '../../CommonTypes';
import JsonML from '../../JsonML';
export default class ListElement implements IFormatterElement {
    private elmObj;
    private formatter;
    constructor(obj: IElmDebugListValue, formatter: IJsonMLFormatter);
    header: (config?: IConfig) => JsonML;
    body: (config?: IConfig) => JsonML | null;
}

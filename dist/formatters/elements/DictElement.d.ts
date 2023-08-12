import { IConfig, IElmDebugDictValue, IFormatterElement, IJsonMLFormatter } from '../../CommonTypes';
import JsonML from '../../JsonML';
export default class DictElement implements IFormatterElement {
    private elmObj;
    private formatter;
    constructor(obj: IElmDebugDictValue, formatter: IJsonMLFormatter);
    header: () => JsonML;
    body: (config?: IConfig) => JsonML;
}

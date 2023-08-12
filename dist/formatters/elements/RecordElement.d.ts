import { IConfig, IElmDebugRecordValue, IFormatterElement, IJsonMLFormatter } from '../../CommonTypes';
import JsonML from '../../JsonML';
export default class RecordElement implements IFormatterElement {
    private elmObj;
    private formatter;
    constructor(obj: IElmDebugRecordValue, formatter: IJsonMLFormatter);
    header: (config: IConfig) => JsonML;
    body: (config: IConfig) => JsonML;
}

import { IConfig, IElmDebugCustomValue, IFormatterElement, IJsonMLFormatter } from '../../CommonTypes';
import JsonML from '../../JsonML';
export default class CustomTypeElement implements IFormatterElement {
    private elmObj;
    private formatter;
    constructor(obj: IElmDebugCustomValue, formatter: IJsonMLFormatter);
    header: (config?: IConfig) => JsonML;
    body: () => JsonML | null;
    private wrappedHeader;
}

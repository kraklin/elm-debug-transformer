import { IElmDebugValue, IFormatterElement, IJsonMLFormatter } from '../../CommonTypes';
import JsonML from '../../JsonML';
export default class DebugElment implements IFormatterElement {
    private elmObj;
    private formatter;
    private elmLogoElement;
    constructor(obj: IElmDebugValue, formatter: IJsonMLFormatter);
    header: () => JsonML;
    body: () => JsonML | null;
}

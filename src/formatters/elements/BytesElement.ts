import { 
  IElmDebugValue, 
  IFormatterElement,
  IJsonMLFormatter
} from '../../CommonTypes';

import JsonML from '../../JsonML';

export default class BytesElement implements IFormatterElement {
    private elmObj: IElmDebugValue;
    private formatter: IJsonMLFormatter;

    constructor(obj: IElmDebugValue, formatter: IJsonMLFormatter) {
        this.elmObj = obj;
        this.formatter = formatter;
    }

    public header() {
        return new JsonML('span')
            .withStyle(this.formatter.theme.bytesStyle)
            .withText(this.elmObj.value + ' B');
    }
}

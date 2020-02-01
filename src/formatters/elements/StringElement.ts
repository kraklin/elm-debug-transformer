import { 
  IElmDebugStringValue, 
  IFormatterElement,
  IJsonMLFormatter
} from '../../CommonTypes';

import JsonML from '../../JsonML';

export default class StringElement implements IFormatterElement {
    private elmObj: IElmDebugStringValue;
    private formatter: IJsonMLFormatter;

    constructor(obj: IElmDebugStringValue, formatter: IJsonMLFormatter) {
        this.elmObj = obj;
        this.formatter = formatter;
    }

    public header() {
        return new JsonML('span')
            .withStyle(this.formatter.theme.stringStyle)
            .withText(`"${this.elmObj.value}"`);
    }
}

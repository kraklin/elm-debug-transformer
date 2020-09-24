import { 
  IElmDebugNumberValue, 
  IFormatterElement,
  IJsonMLFormatter
} from '../../CommonTypes';
import JsonML from '../../JsonML';

export default class NumberElement implements IFormatterElement {
    private elmObj: IElmDebugNumberValue;
    private formatter: IJsonMLFormatter;

    constructor(obj: IElmDebugNumberValue, formatter: IJsonMLFormatter) {
        this.elmObj = obj;
        this.formatter = formatter;
    }

    public header() {
        return new JsonML('span')
            .withStyle(this.formatter.theme.numberStyle)
            .withText(this.elmObj.value);
    }
}

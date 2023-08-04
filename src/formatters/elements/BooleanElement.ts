import { 
  IElmDebugBoolValue, 
  IFormatterElement,
  IJsonMLFormatter

} from '../../CommonTypes';
import JsonML from '../../JsonML';

export default class BooleanElement implements IFormatterElement {
    private elmObj: IElmDebugBoolValue;
    private formatter: IJsonMLFormatter;

    constructor(obj: IElmDebugBoolValue, formatter: IJsonMLFormatter) {
        this.elmObj = obj;
        this.formatter = formatter;
    }

    public header = () => {
        return new JsonML('span')
            .withStyle(this.formatter.theme.booleanStyle)
            .withText(this.elmObj.value ? 'True' : 'False');
    }
}

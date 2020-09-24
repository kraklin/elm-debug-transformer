import { 
  IElmDebugTypeValueType, 
  IFormatterElement,
  IJsonMLFormatter
} from '../../CommonTypes';

import JsonML from '../../JsonML';

export default class TypeElement implements IFormatterElement {
    private elmObj: IElmDebugTypeValueType;
    private formatter: IJsonMLFormatter;

    constructor(obj: IElmDebugTypeValueType, formatter: IJsonMLFormatter) {
        this.elmObj = obj;
        this.formatter = formatter;
    }

    public header() {
        return new JsonML('span')
            .withStyle(this.formatter.theme.typeNameStyle)
            .withText(this.elmObj.name);
    }
}

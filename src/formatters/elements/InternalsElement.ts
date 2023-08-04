import { 
  IFormatterElement,
  IJsonMLFormatter
} from '../../CommonTypes';

import JsonML from '../../JsonML';

export default class InternalsElement implements IFormatterElement {
    private elmObj: string;
    private formatter: IJsonMLFormatter;

    constructor(obj: string, formatter: IJsonMLFormatter) {
        this.elmObj = obj;
        this.formatter = formatter;
    }

    public header = () => {
        let value = '';

        switch (this.elmObj) {
            case 'Internals':
                value = '<internals>';
                break;
            case 'Function':
                value = '<function>';
                break;
            case 'Unit':
                value = '()';
                break;
        }

        return new JsonML('span')
          .withStyle(this.formatter.theme.greyedItalicsStyle)
          .withText(value);
    }
}

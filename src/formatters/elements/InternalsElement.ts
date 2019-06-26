import { IFormatterElement } from '../../CommonTypes';
import JsonML from '../../JsonML';

export default class StringElement implements IFormatterElement {
    private elmObj: string;
    private style = 'color: grey; font-weight: normal; font-style: italic;';

    constructor(obj: string) {
        this.elmObj = obj;
    }

    public header() {
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

        return new JsonML('span').withStyle(this.style).withText(value);
    }
}

import { IFormatterElement } from '../../CommonTypes';
import JsonML from '../../JsonML';

export default class StringElement implements IFormatterElement {
    private elmObj: string;
    private style = 'color: grey; font-weight: normal; font-style: italic;';

    constructor(obj: string) {
        this.elmObj = obj;
    }

    public header() {
        const value =
            this.elmObj === 'Internals' ? '<internals>' : '<function>';

        return new JsonML('span').withStyle(this.style).withText(value);
    }

    public body() {
        return new JsonML('div').withText('Not implemented yet');
    }
}

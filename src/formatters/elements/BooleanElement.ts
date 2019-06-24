import { IFormatterElement } from '../../CommonTypes';
import JsonML from '../../JsonML';

export default class BooleanElement implements IFormatterElement {
    private elmObj: boolean;
    private style = 'color: blue; font-weight: normal;';

    constructor(obj: boolean) {
        this.elmObj = obj;
    }

    public header() {
        return new JsonML('span')
            .withStyle(this.style)
            .withText(this.elmObj ? 'True' : 'False');
    }

    public body() {
        return new JsonML('div').withText('Not implemented yet');
    }
}

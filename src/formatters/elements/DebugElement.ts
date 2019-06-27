import {
    IElmDebugValue,
    IFormatterElement,
    IJsonMLFormatter,
} from '../../CommonTypes';
import JsonML from '../../JsonML';
import EllipsisElement from './EllipsisElement';

export default class DebugElment implements IFormatterElement {
    private elmObj: IElmDebugValue;
    private formatter: IJsonMLFormatter;

    constructor(obj: IElmDebugValue, formatter: IJsonMLFormatter) {
        this.elmObj = obj;
        this.formatter = formatter;
    }

    public header() {
        return new JsonML('span')
            .withChild(new JsonML('span').withText(this.elmObj.name + ': '))
            .withChild(this.formatter.handleHeader(this.elmObj.value));
    }

    public body() {
        return this.formatter.handleBody(this.elmObj.value);
    }
}

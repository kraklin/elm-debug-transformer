import {
    IElmDebugValue,
    IFormatterElement,
    IJsonMLFormatter,
} from '../../CommonTypes';
import JsonML from '../../JsonML';
import EllipsisElement from './EllipsisElement';
import { DebugTagStyle, ElmLogoElementStyle } from './Styles';

export default class DebugElment implements IFormatterElement {
    private elmObj: IElmDebugValue;
    private formatter: IJsonMLFormatter;

    private elmLogoElement = new JsonML('span').withStyle(ElmLogoElementStyle);
    constructor(obj: IElmDebugValue, formatter: IJsonMLFormatter) {
        this.elmObj = obj;
        this.formatter = formatter;
    }

    public header() {
        return new JsonML('span')
            .withChild(this.elmLogoElement)
            .withChild(
                new JsonML('span')
                    .withChild(
                        new JsonML('span')
                            .withStyle(DebugTagStyle)
                            .withText(this.elmObj.name)
                    )
                    .withText(': ')
            )
            .withChild(this.formatter.handleHeader(this.elmObj.value));
    }

    public body() {
        return this.formatter.handleBody(this.elmObj.value);
    }
}

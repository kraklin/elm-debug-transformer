import {
    IElmDebugValue,
    IFormatterElement,
    IJsonMLFormatter,
} from '../../CommonTypes';
import JsonML from '../../JsonML';

export default class DebugElment implements IFormatterElement {
    private elmObj: IElmDebugValue;
    private formatter: IJsonMLFormatter;
    private elmLogoElement: JsonML;

    constructor(obj: IElmDebugValue, formatter: IJsonMLFormatter) {
        this.elmObj = obj;
        this.formatter = formatter;
        this.elmLogoElement = new JsonML('span').withStyle(this.formatter.theme.elmLogoElementStyle);
    }

    public header = () => {
      if (this.elmObj?.value) {
        return new JsonML('span')
            .withChild(this.elmLogoElement)
            .withChild(
                new JsonML('span')
                    .withChild(
                        new JsonML('span')
                            .withStyle(this.formatter.theme.debugTagStyle)
                            .withText(this.elmObj.name)
                    )
                    .withText(': ')
            )
            .withChild(this.formatter.handleHeader(this.elmObj.value));
      }

      return new JsonML('span').withText("WTF");
    }

    public body = () => {
      if (this.elmObj?.value) {
        return this.formatter.handleBody(this.elmObj.value);
      }

      return null;
    }
}

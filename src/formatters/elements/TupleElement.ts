import {
    IChromeConsoleFormatter,
    IElmDebugListValue,
    IFormatterElement,
} from '../../CommonTypes';
import JsonML from '../../JsonML';

export default class TupleElement implements IFormatterElement {
    private elmObj: IElmDebugListValue;
    private formatter: IChromeConsoleFormatter;

    constructor(obj: IElmDebugListValue, formatter: IChromeConsoleFormatter) {
        this.elmObj = obj;
        this.formatter = formatter;
    }

    public header() {
        const children = this.elmObj.value
            .map(child => this.formatter.handleHeader(child))
            .reduce((acc, child) => {
                acc.push(new JsonML('span').withText(', '));
                acc.push(child);
                return acc;
            }, []);

        children.splice(0, 1);

        return new JsonML('span')
            .withText('( ')
            .withChildren(children)
            .withText(' )');
    }
}

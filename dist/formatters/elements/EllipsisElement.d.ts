import { IFormatterElement } from '../../CommonTypes';
import JsonML from '../../JsonML';
export default class EllipsisElement implements IFormatterElement {
    header: () => JsonML;
}

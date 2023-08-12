import { IConfig } from './CommonTypes';
export type TagName = 'div' | 'span';
export default class JSONMLElement {
    private attributes;
    private jsonML;
    constructor(tagName: TagName);
    toJSONML(): any;
    withChild(element: JSONMLElement): this;
    withChildren(elements: JSONMLElement[]): this;
    withObject(key: JSONMLElement, object: any, config?: IConfig): this;
    withStyle(style: string): this;
    withAttribute(key: string, value: any): this;
    withText(value: any): this;
    toStr(): string;
    private toStrInner;
}

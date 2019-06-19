export type TagName =
    | 'div'
    | 'span'
    | 'ol'
    | 'li'
    | 'table'
    | 'tr'
    | 'td'
    | 'object';

export default class JSONMLElement {
    private attributes: { [key: string]: any };
    private jsonML: any[];

    constructor(tagName: TagName) {
        this.attributes = {};
        this.jsonML = [tagName, this.attributes];
    }

    public appendChild(element: JSONMLElement) {
        this.jsonML.push(element.toJSONML());
        return element;
    }

    public setStyle(style: string) {
        this.attributes.style = style;
        return this;
    }

    public addAttribute(key: string, value: any) {
        this.attributes[key] = value;
        return this;
    }

    public createTextChild(text: any) {
        this.jsonML.push(text + '');
        return this;
    }

    public toJSONML() {
        return this.jsonML;
    }
}

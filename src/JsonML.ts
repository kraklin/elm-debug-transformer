export type TagName = 'div' | 'span';

export default class JSONMLElement {
    private attributes: { [key: string]: any };
    private jsonML: any[];

    constructor(tagName: TagName) {
        this.attributes = {};
        this.jsonML = [tagName, this.attributes];
    }

    public toJSONML(): any {
        return this.jsonML;
    }

    public withChild(element: JSONMLElement) {
        this.jsonML.push(element.toJSONML());
        return this;
    }

    public withChildren(elements: JSONMLElement[]) {
        const children = elements.map(child => child.toJSONML());
        this.jsonML = this.jsonML.concat(children);
        return this;
    }

    public withStyle(style: string) {
        this.attributes.style = style;
        return this;
    }

    public withAttribute(key: string, value: any) {
        this.attributes[key] = value;
        return this;
    }

    public withText(value: any) {
        this.jsonML.push(value + '');
        return this;
    }

    public toStr(): string {
        return this.toStrInner(this.jsonML);
    }

    private toStrInner(jsonML: any[]): string {
        return jsonML
            .map((item, index) => {
                if (index < 2) {
                    return '';
                } else if (typeof item === 'string') {
                    return item;
                } else if (item instanceof Array) {
                    return this.toStrInner(item);
                } else {
                    return '';
                }
            })
            .join('');
    }
}

import { describe, expect, it} from 'vitest';
import JsonML from '../src/JsonML';

describe('JsonML', () => {
    it('should return span with empty values after construction', () => {
        expect(new JsonML('span').toJSONML()).to.deep.equal(['span', {}]);
    });

    it('should return span with style attributes', () => {
        expect(
            new JsonML('span').withStyle('color: red;').toJSONML()
        ).to.deep.equal(['span', { style: 'color: red;' }]);
    });
    it('should return div with text child node', () => {
        expect(new JsonML('div').withText('child').toJSONML()).to.deep.equal([
            'div',
            {},
            'child',
        ]);
    });
    it('should return div with two child nodes', () => {
        const child = new JsonML('span');
        const parent = new JsonML('div').withChild(child);
        expect(parent.toJSONML()).to.deep.equal(['div', {}, ['span', {}]]);
    });
});

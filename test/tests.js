const should = require('chai').should()
const peg = require('pegjs');
const fs = require('fs');

const parser = peg.generate(fs.readFileSync("src/elm-debug.pegjs", "utf8"));

describe('Parsing', () => {
  describe('Basic type parsing',() => {
    it('Basic type',()=>{
      parser.parse("tag string: True").should.deep.equal({"tag string": "True"});
    });

    it('Integer',()=>{
      parser.parse("integer: 123").should.deep.equal({"integer": 123});
    });

    it('Float',()=>{
      parser.parse("float: 123.45").should.deep.equal({"float": 123.45});
    });

    it('String',()=>{
      parser.parse('string: "Lorem Ipsum."').should.deep.equal({"string": "Lorem Ipsum."});
    });
  });

  describe('Tuples', () => {
    it('Basic tuple', () => {
      parser.parse("tuple: (123, True)").should.deep.equal({"tuple": {"Tuple":[123,"True"]}});
    });
    it('Arbitrary long tuple', () => {
      parser.parse('tuple: (123, "Some string.", True, 12.34)').should.deep.equal({"tuple": {"Tuple": [123, "Some string.",  "True", 12.34]}});
    });
    it('Tuple in tuple', () => {
      parser.parse('tuple in tuple: (123, "Some string.", (True, 12.34))').should.deep.equal({"tuple in tuple": {"Tuple": [123, "Some string.",  {"Tuple": ["True", 12.34]}]}});
    });
  });

  describe('Union types', () => {
    it('Maybe', () => {
      parser.parse("maybe: (Just (1,2), Nothing)").should.deep.equal({"maybe": {"Tuple":[{"Just":[{"Tuple":[1,2]}]},"Nothing"]}});
    });
  });
});

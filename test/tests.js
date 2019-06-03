const should = require('chai').should()
const peg = require('pegjs');
const fs = require('fs');

const parser = peg.generate(fs.readFileSync("src/elm-debug.pegjs", "utf8"));

describe('Parsing', () => {
  describe('Basic type parsing',() => {
    it('Boolean',()=>{
      parser.parse("tag string: True").should.deep.equal({"tag string": true});
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
      parser.parse("tuple: (123, False)").should.deep.equal({"tuple": {"Tuple":[123, false]}});
    });
    it('Arbitrary long tuple', () => {
      parser.parse('tuple: (123, "Some string.", True, 12.34)').should.deep.equal({"tuple": {"Tuple": [123, "Some string.", true, 12.34]}});
    });
    it('Tuple in tuple', () => {
      parser.parse('tuple in tuple: (123, "Some string.", (True, 12.34))').should.deep.equal({"tuple in tuple": {"Tuple": [123, "Some string.",  {"Tuple": [true, 12.34]}]}});
    });
  });

  describe('List', () => {
    it('Empty list', () => {
      parser.parse("list: []").should.deep.equal({"list": []});
    });

    it('Singleton', () => {
      parser.parse("singleton: [1]").should.deep.equal({"singleton": [1]});
    });
    it('List', () => {
      parser.parse("list: [\"s1\",\"s2\",\"s3\",\"s4\"]").should.deep.equal({"list": ["s1", "s2", "s3", "s4"]});
    });
    it('List of tuples', () => {
      parser.parse("list: [(\"s1\",\"s2\"),(\"s3\",\"s4\")]").should.deep.equal({"list": [{"Tuple":["s1", "s2"]}, {"Tuple":["s3", "s4"]}]});
    });
  });

  describe('Dict', () => {
    it('Empty dict', () => {
      parser.parse("dict: Dict.fromList []").should.deep.equal({"dict": {"Dict": []}});
    });
    it('Filled dict', () => {
      parser.parse("dict: Dict.fromList [(1,\"a\"),(2,\"b\")]").should.deep.equal({"dict": {"Dict": [{"Tuple":[1,"a"]},{"Tuple":[2,"b"]}]}});
    });
  });

  describe('Record', () => {
    it('Empty record', () => {
      parser.parse("record: {}").should.deep.equal({"record": {}});
    });
    it('Record', () => {
      parser.parse("record: { name = \"Name\" }").should.deep.equal({"record": {"name": "Name"}});
    });
    it('Record with more values', () => {
      parser.parse("record: { name = \"Name\", warning = Nothing, waves = [] }").should.deep.equal({"record": {"name": "Name", "warning": "Nothing", "waves": []}});
    });
    it('Nested records', () => {
      parser.parse("record: { name = \"Name\", warning = { name = Nothing, waves = [] } }").should.deep.equal({"record": {"name": "Name", "warning": {"name": "Nothing", "waves": []}}});
    });
  });

  
});

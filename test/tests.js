const should = require('chai').should()
const peg = require('pegjs');
const fs = require('fs');

const parser = peg.generate(fs.readFileSync("src/elm-debug.pegjs", "utf8"));

describe('Parsing', () => {
  describe('Basic type parsing',() => {
    it('Boolean',()=>{
      parser.parse("tag string: True").value.should.deep.equal(true);
    });

    it('Integer',()=>{
      parser.parse("integer: 123").value.should.deep.equal(123);
    });

    it('Float',()=>{
      parser.parse("float: 123.45").value.should.deep.equal(123.45);
    });

    it('String',()=>{
      parser.parse('string: "Lorem Ipsum."').value.should.deep.equal("Lorem Ipsum.");
    });
  });

  describe('Tuples', () => {
    it('Empty tuple', () => {
      parser.parse("tuple: ()").value.should.deep.equal({type:"EmptyTuple"});
    });

    it('Basic tuple', () => {
      parser.parse("tuple: (123, False)").value.should.deep.equal({type:"Tuple", "fst": 123, "snd":false});
    });

    it('Arbitrary long tuple', () => {
      parser.parse('tuple: (123, "Some string.", True, 12.34)').value.should.deep.equal({type: "Tuple", "fst": 123, "snd":"Some string.", "others": [true, 12.34]});
    });

    it('Tuple in tuple', () => {
      parser.parse('tuple in tuple: (123, (True, 12.34))').value.should.deep.equal({type: "Tuple", "fst": 123, "snd": {type: "Tuple", "fst": true, "snd": 12.34}});
    });
  });

  describe('List', () => {
    it('Empty list', () => {
      parser.parse("list: []").value.should.deep.equal([]);
    });

    it('Singleton', () => {
      parser.parse("singleton: [1]").value.should.deep.equal([1]);
    });
    it('List', () => {
      parser.parse("list: [\"s1\",\"s2\",\"s3\",\"s4\"]").value.should.deep.equal(["s1", "s2", "s3", "s4"]);
    });
    it('List of tuples', () => {
      parser.parse("list: [(\"s1\",\"s2\"),(\"s3\",\"s4\")]").value.should.deep.equal([{type: "Tuple", "fst":"s1", "snd": "s2"}, {type: "Tuple", "fst": "s3", "snd":"s4"}]);
    });
  });

  describe('Dict', () => {
    it('Empty dict', () => {
      parser.parse("dict: Dict.fromList []").value.should.deep.equal({type:"Dict", values: []});
    });
    it('Filled dict', () => {
      parser.parse("dict: Dict.fromList [(1,\"a\"),(2,\"b\")]").value.should.deep.equal({type:"Dict", values: [{"key": 1,"value":"a"},{"key":2,"value":"b"}]});
    });
  });

  describe('Record', () => {
    it('Empty record', () => {
      parser.parse("record: {}").value.should.deep.equal({});
    });
    it('Record', () => {
      parser.parse("record: { name = \"Name\" }").value.should.deep.equal({"name": "Name"});
    });
    it('Record with more values', () => {
      parser.parse("record: { name = \"Name\", warning = Nothing, waves = [] }").value.should.deep.equal({"name": "Name", "warning": "Nothing", "waves": []});
    });
    it('Nested records', () => {
      parser.parse("record: { name = \"Name\", warning = { name = Nothing, waves = [] } }").value.should.deep.equal({"name": "Name", "warning": {"name": "Nothing", "waves": []}});
    });
  });

  describe('Custom types', () => {
    it('Custom type with one value', () => {
      parser.parse("custom type: User \"Adam\"").value.should.deep.equal({type: "Custom", name: "User", values: ["Adam"]});
    });
    it('Custom type with more values', () => {
      parser.parse("custom type: User \"Adam\" 123 (1,False)").value.should.deep.equal({type: "Custom", name: "User", values: ["Adam", 123, {type: "Tuple","fst": 1, "snd": false}]});
    });
    it('Custom type in parenthesis', () => {
      parser.parse("custom type: (User (Data \"Adam\" 123 (1,False)))").value.should.deep.equal({type: "Custom", name: "User", values: [{type: "Custom", name: "Data", values: ["Adam", 123, {type: "Tuple", "fst": 1, "snd": false}]}]});
    });
    it('Custom type in parenthesis with record', () => {
      parser.parse("custom type: (User { age = 23 })").value.should.deep.equal({type: "Custom", name: "User", values: [{"age": 23}]});
    });
    it('Custom type with more values in parenthesis', () => {
      parser.parse("custom type: User (Data \"Adam\" 123 (1,False))").value.should.deep.equal({type: "Custom", name: "User", values: [{type: "Custom", name: "Data", values: ["Adam", 123, {type: "Tuple", "fst": 1, "snd": false}]}]});
    });
  });

  describe('Function', () => {
    it('Function value', () => {
      parser.parse("custom type: <function>").value.should.deep.equal("(func..)");
    });
  });
  
});

const should = require('chai').should()
const peg = require('pegjs');
const fs = require('fs');

const parser = peg.generate(fs.readFileSync("src/elm-debug.pegjs", "utf8"));

describe('Parsing', () => {
  describe('Basic type parsing',() => {

    it('without tag tag',()=>{
      parser.parse(": True").value.should.deep.equal(true);
    });
    
    it('with multiple `:` in the tag',()=>{
      parser.parse("tag string :: : True").value.should.deep.equal(true);
    });

    it('Boolean',()=>{
      parser.parse("tag string: True").value.should.deep.equal(true);
    });

    it('Integer',()=>{
      parser.parse("integer: 123").value.should.deep.equal({type: "Number", value: 123});
    });

    it('Negative Integer',()=>{
      parser.parse("integer: - 123").value.should.deep.equal({type: "Number", value: -123});
    });

    it('Float',()=>{
      parser.parse("float: 123.45").value.should.deep.equal({type: "Number", value: 123.45});
    });

    it('Negative Float',()=>{
      parser.parse("float: - 123.45").value.should.deep.equal({type: "Number", value: -123.45});
    });

    it('String',()=>{
      parser.parse('string: "Lorem Ipsum."').value.should.deep.equal("Lorem Ipsum.");
    });

    it('String with escaped quotes',()=>{
      parser.parse('string: "Lorem Ipsum. \\\"with some quotes\\\""').value.should.deep.equal('Lorem Ipsum. "with some quotes"');
    });
  });

  describe('Tuples', () => {
    it('Empty tuple', () => {
      parser.parse("tuple: ()").value.should.deep.equal({type:"Unit"});
    });

    it('Basic tuple', () => {
      parser.parse("tuple: (123, False)").value.should.deep.equal({type:"Tuple", value: [{type: "Number", value: 123}, false]});
    });

    it('Arbitrary long tuple', () => {
      parser.parse('tuple: (123, "Some string.", True, 12.34)').value.should.deep.equal({type: "Tuple", value: [{type: "Number", value: 123}, "Some string.", true, {type: "Number", value: 12.34}]});
    });

    it('Tuple in tuple', () => {
      parser.parse('tuple in tuple: (123, (True, 12.34))').value.should.deep.equal({type: "Tuple", value: [{type: "Number", value: 123}, {type: "Tuple", value:[true, {type: "Number", value: 12.34}]}]});
    });
  });

  describe('List', () => {
    it('Empty list', () => {
      parser.parse("list: []").value.should.deep.equal({type: "List", value: []});
    });

    it('Singleton', () => {
      parser.parse("singleton: [1]").value.should.deep.equal({type: "List", value: [{type: "Number", value: 1}]});
    });
    it('List', () => {
      parser.parse("list: [\"s1\",\"s2\",\"s3\",\"s4\"]").value.should.deep.equal({type: "List", value: ["s1", "s2", "s3", "s4"]});
    });
    it('List of tuples', () => {
      parser.parse("list: [(\"s1\",\"s2\"),(\"s3\",\"s4\")]").value.should.deep.equal({type: "List", value: [{type: "Tuple", value: ["s1", "s2"]}, {type: "Tuple", value: ["s3", "s4"]}]});
    });
  });

  describe('Dict', () => {
    it('Empty dict', () => {
      parser.parse("dict: Dict.fromList []").value.should.deep.equal({type:"Dict", value: []});
    });
    it('Filled dict', () => {
      parser.parse("dict: Dict.fromList [(1,\"a\"),(2,\"b\")]").value.should.deep.equal({type:"Dict", value: [{"key": {type: "Number", value: 1},"value":"a"},{"key":{type: "Number", value: 2},"value":"b"}]});
    });
  });

  describe('Set', () => {
    it('Empty Set', () => {
      parser.parse("Set: Set.fromList []").value.should.deep.equal({type:"Set", value: []});
    });
    it('Filled set', () => {
      parser.parse("Set: Set.fromList [\"1\",\"2\",\"3\"]").value.should.deep.equal({type:"Set", value: ["1","2","3"]});
    });
  });

  describe('Array', () => {
    it('Empty Array', () => {
      parser.parse("Array: Array.fromList []").value.should.deep.equal({type:"Array", value: []});
    });
    it('Filled Array', () => {
      parser.parse("Array: Array.fromList [\"1\",\"2\",\"3\"]").value.should.deep.equal({type:"Array", value: ["1","2","3"]});
    });
  });

  describe('Record', () => {
    it('Empty record', () => {
      parser.parse("record: {}").value.should.deep.equal({type: "Record", value: {}});
    });
    it('Record', () => {
      parser.parse("record: { name = \"Name\" }").value.should.deep.equal({type: "Record", value: {"name": "Name"}});
    });
    it('Record with more values', () => {
      parser.parse("record: { name = \"Name\", warning = Nothing, waves = [] }").value.should.deep.equal({type: "Record", value: {"name": "Name", "warning": {type: "Type", name:"Nothing"}, "waves": {type: "List", value: []}}});
    });
    it('Nested records', () => {
      parser.parse("record: { name = \"Name\", warning = { name = Nothing, waves = [] } }").value.should.deep.equal({type: "Record", value: {"name": "Name", "warning": {type: "Record", value: {"name": {type: "Type", name: "Nothing"}, "waves": {type: "List", value: []}}}}});
    });
  });

  describe('Custom types', () => {
    it('Custom type with one value', () => {
      parser.parse("custom type: User \"Adam\"").value.should.deep.equal({type: "Custom", name: "User", value: ["Adam"]});
    });
    it('Custom type with more values', () => {
      parser.parse("custom type: User \"Adam\" 123 (1,False)").value.should.deep.equal({type: "Custom", name: "User", value: ["Adam", {type: "Number", value: 123}, {type: "Tuple", value: [{type: "Number", value: 1},  false]}]});
    });
    it('Custom type in parenthesis', () => {
      parser.parse("custom type: (User (Data \"Adam\" 123 (1,False)))").value.should.deep.equal({type: "Custom", name: "User", value: [{type: "Custom", name: "Data", value: ["Adam", {type: "Number", value: 123}, {type: "Tuple", value: [{type: "Number", value: 1}, false]}]}]});
    });
    it('Custom type in parenthesis with record', () => {
      parser.parse("custom type: (User { age = 23 })").value.should.deep.equal({type: "Custom", name: "User", value: [{type: "Record", value: {"age": {type: "Number", value:  23}}}]});
    });
    it('Custom type with more values in parenthesis', () => {
      parser.parse("custom type: User (Data \"(tuple, in, string)\" 123 (1,False))").value.should.deep.equal({type: "Custom", name: "User", value: [{type: "Custom", name: "Data", value: ["(tuple, in, string)", {type: "Number", value: 123}, {type: "Tuple", value: [{type: "Number", value: 1}, false]}]}]});
    });
  });

  describe('Function', () => {
    it('Function value', () => {
      parser.parse("custom type: <function>").value.should.deep.equal({type: "Function"});
    });
  });
  
});

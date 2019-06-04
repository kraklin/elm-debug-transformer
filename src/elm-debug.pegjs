// Set.toList, Array.toList
{
  function toStr(chars) {return chars.join("")};
}

DebugString 
  = tag:Tag ": " value:Value {return {type: "ElmDebug", tag: tag, value: value};}

Value
  = Record / Array / Set / Dict / List / Tuple / CustomTypeWithParens / Float / Integer / Boolean / Type / Function / String

Record
  = "{}" {return {};}
  / "{ " chars:[a-zA-Z]+ " = " value:Value " }" {return {[toStr(chars)]: value}}
  / "{ " chars:[a-zA-Z]+ " = " value:Value values:(", " tag:[a-zA-Z]+ " = " otherVal:Value {return {[toStr(tag)]: otherVal};})* " }" {return [{[toStr(chars)]: value},...values].reduce((item, obj) => {return {...item,...obj} },{});}

Dict
  = "Dict.fromList " values:List {return {type: "Dict", values: values.map((item) => { return {key: item.fst, value: item.snd};})}}

Set
  = "Set.fromList " values:List {return {type: "Set", values: values};}

Array
  = "Array.fromList " values:List {return {type: "Array", values: values};}


List
  = "[]" {return [];} 
  / list:("[" singleton:Value "]" {return singleton;}) {return [list];}
  / "[" head:Value tail:("," value:Value {return value;})+ "]" {return [head, ...tail]}
  
Float =
  digits:[0-9\.]+ {return parseFloat(toStr(digits));}

Integer = 
	digits:[0-9]+ {return parseInt(toStr(digits), 10);}

Tuple
  = "()" {return {type:"EmptyTuple"}}
  / "(" fst:Value "," [ ]* snd:Value others:("," [ ]* item:Value {return item;})* ")" {if (others.length == 0) return {type: "Tuple", "fst":fst, "snd":snd}; else return {type: "Tuple", "fst":fst, "snd": snd, "others": others};}

CustomTypeWithParens
  = "(" customType:CustomType ")" {return customType;}
  / CustomType

CustomType 
  = main:Type values:(" " value:Value {return value;})+ {return {type: "Custom", name: main, values: values};}
  / main:Type " (" customType:CustomType ")" {return {type: "Custom", name: main, values: customType};}

Boolean
  = "True" {return true;}
  / "False" {return false;}

Function
  = "<function>" {return "(func..)";}

String =
  "\"" chars:([^\"])* "\"" {return toStr(chars);}

Type = 
	type:[a-zA-Z]+ {return toStr(type);}

Tag =
	tag:[a-zA-Z ]+ {return toStr(tag);}


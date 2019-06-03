DebugString 
  = tag:Tag ": " value:Value {return {type: "ElmDebug", tag: tag, value: value};}

Value
  = Record / Dict / List / Tuple / CustomTypeWithParens / Float / Integer / Boolean / Type / Function / String

Record
  = "{}" {return {};}
  / "{ " chars:[a-zA-Z]+ " = " value:Value " }" {return {[chars.join("")]: value}}
  / "{ " chars:[a-zA-Z]+ " = " value:Value values:(", " tag:[a-zA-Z]+ " = " otherVal:Value {return {[tag.join("")]: otherVal};})* " }" {return [{[chars.join("")]: value},...values].reduce((item, obj) => {return {...item,...obj} },{});}

Dict
  = "Dict.fromList " dict:List {return {"Dict": dict}}

List
  = "[]" {return [];} 
  / list:("[" singleton:Value "]" {return singleton;}) {return [list];}
  / "[" head:Value tail:("," value:Value {return value;})+ "]" {return [head, ...tail]}
  
Float =
  digits:[0-9\.]+ {return parseFloat(digits.join(""));}

Integer = 
	digits:[0-9]+ {return parseInt(digits.join(""), 10);}

Tuple
  = "()" {return {"Tuple":{}}}
  / "(" fst:Value "," [ ]* snd:Value others:("," [ ]* item:Value {return item;})* ")" {if (others.length == 0) return {"Tuple":{"fst":fst, "snd":snd}}; else return {"Tuple":{"fst":fst, "snd": snd, "others": others}};}

CustomTypeWithParens
  = "(" customType:CustomType ")" {return customType;}
  / CustomType

CustomType 
  = main:Type values:(" " value:Value {return value;})+ {if (values.length == 1) return {[main]: values[0]}; else return {[main]: values};}
  / main:Type " (" customType:CustomType ")" {return {[main]: customType}}

Boolean
  = "True" {return true;}
  / "False" {return false;}

Function
  = "<function>" {return "(func..)";}

String =
  "\"" chars:([^\"])* "\"" {return chars.join("");}

Type = 
	type:[a-zA-Z]+ {return type.join("");}

Tag =
	tag:[a-zA-Z ]+ {return tag.join("");}


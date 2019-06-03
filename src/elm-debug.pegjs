DebugString 
  = tag:Tag ": " expression:Value {return {[tag]: expression};}

Value
  = Record / Dict / List / Tuple / Float / Integer / Boolean / Type / String

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
  = "(" fst:Value others:("," [ ]* snd:Value {return snd;})+ ")" {return {"Tuple":[fst,...others]};}

Boolean
  = "True" {return true;}
  / "False" {return false;}

String =
  "\"" chars:([^\"])* "\"" {return chars.join("");}

Type = 
	type:[a-zA-Z]+ {return type.join("");}

Tag =
	tag:[a-zA-Z ]+ {return tag.join("");}


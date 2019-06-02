DebugString 
  = tag:Tag ": " expression:Expression {return {[tag]: expression};}

Expression 
  = Tuple / Value

Tuple
  = "(" fst:Value others:("," [ ]* snd:Value {return snd;})+ ")" {return {"Tuple":[fst,...others]};}

Value
  = Tuple / UnionType / Type / Float / Integer / String
  
String =
  "\"" chars:([^\"])* "\"" {return chars.join("");}

Float =
  digits:[0-9\.]+ {return parseFloat(digits.join(""));}

Integer = 
	digits:[0-9]+ {return parseInt(digits.join(""), 10);}

UnionType =
  baseType:Type otherValues:(" " value:Value {return value;})+ { return {[baseType]: otherValues}}

Type = 
	type:[a-zA-Z]+ {return type.join("");}

Tag =
	tag:[a-zA-Z ]+ {return tag.join("");}


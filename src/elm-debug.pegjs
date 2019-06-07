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

Tuple
  = "()" {return {type:"EmptyTuple"}}
  / "(" fst:Value "," [ ]* snd:Value others:(_ "," _ item:Value {return item;})* ")" {if (others.length == 0) return {type: "Tuple", "fst":fst, "snd":snd}; else return {type: "Tuple", "fst":fst, "snd": snd, "others": others};}

CustomTypeWithParens
  = "(" _ customType:CustomType _ ")" {return customType;}
  / CustomType

CustomType 
  = main:Type values:(_ value:Value {return value;})+ {return {type: "Custom", name: main, values: values};}
  / main:Type _ "(" _ customType:CustomType _ ")" {return {type: "Custom", name: main, values: customType};}

List
  = "[]" {return [];} 
  / list:("[" singleton:Value "]" {return singleton;}) {return [list];}
  / "[" head:Value tail:("," _ value:Value {return value;})+ "]" {return [head, ...tail]}
  

Function
  = "<function>" {return {type: "Function"};}

Float =
  digits:[0-9\.]+ {return parseFloat(toStr(digits));}
	/ "-" _ digits:[0-9\.]+ {return parseFloat("-"+toStr(digits));}

Integer = 
	digits:[0-9]+ {return parseInt(toStr(digits), 10);}
	/ "-" _ digits:[0-9]+ {return parseInt("-"+toStr(digits), 10);}

Boolean
  = "True" {return true;}
  / "False" {return false;}

Type = 
	type:[a-zA-Z]+ {return toStr(type);}

Tag =
	tag:[a-zA-Z ]+ {return toStr(tag);}

String
  = '"' chars:DoubleStringCharacter* '"' { return chars.join(''); }
  / "'" chars:SingleStringCharacter* "'" { return chars.join(''); }

DoubleStringCharacter
  = !('"' / "\\") char:. { return char; }
  / "\\" sequence:EscapeSequence { return sequence; }

SingleStringCharacter
  = !("'" / "\\") char:. { return char; }
  / "\\" sequence:EscapeSequence { return sequence; }

EscapeSequence
  = "'"
  / '"'
  / "\\"
  / "b"  { return "\b";   }
  / "f"  { return "\f";   }
  / "n"  { return "\n";   }
  / "r"  { return "\r";   }
  / "t"  { return "\t";   }
  / "v"  { return "\x0B"; }

_ "whitespace"
  = [ \t\n\r]*


// Set.toList, Array.toList
{
  function toStr(chars) {return chars.join("")};
}

DebugString 
  = tag:Tag ": " value:Value {return {type: "ElmDebug", tag: tag, value: value};}

Value
  = Record / Array / Set / Dict / List / CustomTypeWithParens / Tuple / Number / Boolean / Type / Function / String

Record
  = "{}" {return {};}
  / "{ " chars:[a-zA-Z]+ " = " value:Value " }" {return {[toStr(chars)]: value}}
  / "{ " chars:[a-zA-Z]+ " = " value:Value values:(", " tag:[a-zA-Z]+ " = " otherVal:Value {return {[toStr(tag)]: otherVal};})* " }" {return [{[toStr(chars)]: value},...values].reduce((item, obj) => {return {...item,...obj} },{});}

Dict
  = "Dict.fromList " values:List {return {type: "Dict", value: values.map((tuple) => { return {key: tuple.value[0], value: tuple.value[1]};})}}

Set
  = "Set.fromList " values:List {return {type: "Set", value: values};}

Array
  = "Array.fromList " values:List {return {type: "Array", value: values};}

Tuple
  = "()" {return {type:"EmptyTuple"}}
  / "(" head:Value others:(_ "," _ item:Value {return item;})* ")" {return {type: "Tuple", value: [head,...others]};}

CustomTypeWithParens
  = "(" _ customType:CustomType _ ")" {return customType;}
  / CustomType

CustomType 
  = main:Type values:(_ value:Value {return value;})+ {return {type: "Custom", name: main, value: values};}
  / main:Type _ "(" _ customType:CustomType _ ")" {return {type: "Custom", name: main, value: customType};}

List
  = "[]" {return [];} 
  / list:("[" singleton:Value "]" {return singleton;}) {return [list];}
  / "[" head:Value tail:("," _ value:Value {return value;})+ "]" {return [head, ...tail]}
  

Function
  = "<function>" {return {type: "Function"};}

Number =
  digits:[0-9\.]+ {return {type: "Number", value: parseFloat(toStr(digits))};}
	/ "-" _ digits:[0-9\.]+ {return {type: "Number", value: parseFloat("-"+toStr(digits))};}

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


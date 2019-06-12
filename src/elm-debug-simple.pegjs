// Set.toList, Array.toList
{
  function toStr(chars) {return chars.join("")};
}

DebugString 
  = tag:Tag (":" _ )+ value:Value {return value;}
  / ":" _ value:Value {return value;}

Value
  = Record / Array / Set / Dict / List / CustomTypeWithParens / Tuple / Number / Boolean / Type / Internals / String

Record
  = "{}" {return {};}
  / "{ " chars:[a-zA-Z]+ " = " value:Value " }" {return {[toStr(chars)]: value}}
  / "{ " chars:[a-zA-Z]+ " = " value:Value values:(", " tag:[a-zA-Z]+ " = " otherVal:Value {return {[toStr(tag)]: otherVal};})* " }" { var composed = [{[toStr(chars)]: value},...values].reduce((item, obj) => {return {...item,...obj} },{}); return composed}

Dict
  = "Dict.fromList " values:ListValue {return values.map((tuple) => { return {[tuple[0]]: tuple[1]};})}

Set
  = "Set.fromList " values:ListValue {return values;}

Array
  = "Array.fromList " values:ListValue {return values;}

Tuple
  = "()" {return "()"}
  / "(" head:Value others:(_ "," _ item:Value {return item;})* ")" {return [head,...others];}

CustomTypeWithParens
  = "(" _ customType:CustomType _ ")" {return customType;}
  / CustomType

CustomType 
  = mainType:Type values:(_ value:Value {return value;})+ {return {[mainType]: values};}
  / mainType:Type _ "(" _ customType:CustomType _ ")" {return {[mainType]: customType};}

List 
  = list:ListValue {return list;}


Number =
  digits:[0-9\.]+ {return parseFloat(toStr(digits));}
	/ "-" _ digits:[0-9\.]+ {return parseFloat("-"+toStr(digits));}

Boolean
  = "True" {return true;}
  / "False" {return false;}

Internals
  = "<function>" {return {type: "<function>"};}
  / "<internals>" {return {type: "<internals>"};}

Type = 
	type:[a-zA-Z]+ {return toStr(type);}

Tag =
	tag:[a-zA-Z ]+ {return toStr(tag);}

String
  = '"' chars:DoubleStringCharacter* '"' { return chars.join(''); }
  / "'" chars:SingleStringCharacter* "'" { return chars.join(''); }


ListValue
  = "[]" {return [];} 
  / list:("[" singleton:Value "]" {return singleton;}) {return [list];}
  / "[" head:Value tail:("," _ value:Value {return value;})+ "]" {return [head, ...tail]}
  

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



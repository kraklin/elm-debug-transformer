// Set.toList, Array.toList
{
  function toStr(chars) {return chars.join("")};
}

DebugString 
  = tag:Tag (":" _ )+ value:Value {return {type: "ElmDebug", tag: tag, value: value};}
  / ":" _ value:Value {return {type: "ElmDebug", tag: "", value: value};}

Value
  = Record / Array / Set / Dict / List / CustomTypeWithParens / Tuple / Number / Boolean / Type / Internals / Bytes / File / String

Record
  = "{}" {return {type: "Record", value: {}};}
  / "{ " key:VariableName " = " value:Value " }" {return {type: "Record", value: {[key]: value}}}
  / "{ " key:VariableName " = " value:Value values:(", " tag:VariableName " = " otherVal:Value {return {[tag]: otherVal};})* " }" { var composed = [{[key]: value},...values].reduce((item, obj) => {return {...item,...obj} },{}); return {type: "Record", value: composed}}

Dict
  = "Dict.fromList " values:ListValue {return {type: "Dict", value: values.map((tuple) => { return {key: tuple.value[0], value: tuple.value[1]};})}}

Set
  = "Set.fromList " values:ListValue {return {type: "Set", value: values};}

Array
  = "Array.fromList " values:ListValue {return {type: "Array", value: values};}

Tuple
  = "()" {return {type:"Unit"}}
  / "(" head:Value others:(_ "," _ item:Value {return item;})* ")" {return {type: "Tuple", value: [head,...others]};}

CustomTypeWithParens
  = "(" _ customType:CustomType _ ")" {return customType;}
  / CustomType

CustomType 
  = mainType:Type values:(_ value:Value {return value;})+ {return {type: "Custom", name: mainType.name, value: values};}
  / mainType:Type _ "(" _ customType:CustomType _ ")" {return {type: "Custom", name: mainType.name, value: customType};}

List 
  = list:ListValue {return {type: "List", value: list};}


Number =
  digits:[0-9\.]+ {return {type: "Number", value: parseFloat(toStr(digits))};}
	/ "-" _ digits:[0-9\.]+ {return {type: "Number", value: parseFloat("-"+toStr(digits))};}

Boolean
  = "True" {return true;}
  / "False" {return false;}

Internals
  = "<function>" {return {type: "Function"};}
  / "<internals>" {return {type: "Internals"};}

Bytes 
  = "<" digits:[0-9]+ " bytes>" {return {type: "Bytes", value: parseInt(toStr(digits), 10)};}

File
  = "<" chars:(!('"' / "\\" / "<" / ">") char:. { return char; })+ ">" {return { type: "File", value: chars.join('') };}

VariableName =
	chars:[a-zA-Z0-9_]+ {return toStr(chars);}
    
Type = 
	type:[a-zA-Z]+ {return {type: "Type", name: toStr(type)};}

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


import * as T from '../../CommonTypes';

import BooleanElement from './BooleanElement';
import BytesElement from './BytesElement';
import CustomTypeElement from './CustomTypeElement';
import DebugElement from './DebugElement';
import DictElement from './DictElement';
import FilesElement from './FilesElement';
import InternalsElement from './InternalsElement';
import ListElement from './ListElement';
import NumberElement from './NumberElement';
import RecordElement from './RecordElement';
import StringElement from './StringElement';
import TupleElement from './TupleElement';
import TypeElement from './TypeElement';

export function toElement(
    obj: T.ElmDebugValueType,
    formatter: T.IJsonMLFormatter
): T.IFormatterElement | null {
    if (obj.type === 'String') {
        return new StringElement(obj as T.IElmDebugStringValue);
    } else if (obj.type === 'Boolean') {
        return new BooleanElement(obj as T.IElmDebugBoolValue);
    } else if (T.isElmValue(obj) && obj.type === 'ElmDebug') {
        return new DebugElement(obj, formatter);
    } else if (T.isElmNumberType(obj)) {
        return new NumberElement(obj);
    } else if (T.isElmTypeValue(obj)) {
        return new TypeElement(obj);
    } else if (T.isElmCustomValue(obj)) {
        return new CustomTypeElement(obj, formatter);
    } else if (T.isElmDictValue(obj)) {
        return new DictElement(obj, formatter);
    } else if (T.isElmListValue(obj)) {
        return obj.type === 'Tuple'
            ? new TupleElement(obj, formatter)
            : new ListElement(obj, formatter);
    } else if (T.isElmRecordValue(obj)) {
        return new RecordElement(obj, formatter);
    } else if (
        obj.type === 'Function' ||
        obj.type === 'Internals' ||
        obj.type === 'Unit'
    ) {
        return new InternalsElement(obj.type as string);
    } else if (obj.type === 'Bytes') {
        return new BytesElement(obj as T.IElmDebugValue);
    } else if (obj.type === 'File') {
        return new FilesElement(obj as T.IElmDebugValue);
    }

    return null;
}

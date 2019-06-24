import * as T from '../../CommonTypes';

import BooleanElement from './BooleanElement';
import CustomTypeElement from './CustomTypeElement';
import DictElement from './DictElement';
import ListElement from './ListElement';
import NumberElement from './NumberElement';
import RecordElement from './RecordElement';
import StringElement from './StringElement';
import TupleElement from './TupleElement';
import TypeElement from './TypeElement';

export function toElement(
    obj: T.ElmDebugValueType,
    formatter: T.IJsonMLFormatter
): T.IFormatterElement {
    if (typeof obj === 'string') {
        return new StringElement(obj);
    } else if (typeof obj === 'boolean') {
        return new BooleanElement(obj);
    } else if (T.isElmNumberType(obj)) {
        return new NumberElement(obj);
    } else if (T.isElmTypeValue(obj)) {
        return new TypeElement(obj);
    } else if (T.isElmCustomValue(obj)) {
        return new CustomTypeElement(obj, formatter);
    } else if (T.isElmDictValue(obj)) {
        return new DictElement(obj);
    } else if (T.isElmListValue(obj)) {
        return obj.type === 'Tuple'
            ? new TupleElement(obj, formatter)
            : new ListElement(obj);
    } else if (T.isElmRecordValue(obj)) {
        return new RecordElement(obj, formatter);
    }
}

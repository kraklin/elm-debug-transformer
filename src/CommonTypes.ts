export interface ElmDebug {
  tag: string;
  value: ElmDebugValue | {key: string, value:ElmDebugValue}[] | Number | String | Boolean
}


export interface ElmDebugValue {
  type: string;
  name?: string;
  value?: ElmDebugValue | {key: string, value:ElmDebugValue}[] | Number | String | Boolean
}

export interface IFormatter {
  format(obj: ElmDebug):any;
}


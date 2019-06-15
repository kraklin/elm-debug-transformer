import {ElmDebug, IFormatter} from '../CommonTypes';

export default class SimpleFormatter implements IFormatter{

  formatValue(a:any){
    return ""
  };

  public format(obj: ElmDebug):any{
    return this.formatValue(obj.value);
  };

}

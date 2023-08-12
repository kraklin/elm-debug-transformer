import { IElmDebugValue, IThemeOption } from './CommonTypes';
declare global {
    interface Window {
        chrome: any;
        __ELM_DEBUG_TRANSFORM_OPTIONS__?: IOptions;
    }
}
interface IOptions {
    active?: boolean;
    debug?: boolean;
    simple_mode?: boolean;
    limit?: number;
    theme?: IThemeOption;
}
export declare function parse(message: string): Promise<IElmDebugValue>;
export declare function register(opts: IOptions | undefined): IOptions;
export {};

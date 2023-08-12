import * as _ from 'lodash';
import { IElmDebugValue, IThemeOption } from './CommonTypes';
//import { parse as elmDebugParse } from './elm-debug-parser';
import {Elm} from './elm-debug.js';
import { darkTheme, lightTheme  } from './formatters/elements/Styles';
import JsonMLFormatter from './formatters/JsonMLFormatter';
import SimpleFormatter from './formatters/SimpleFormatter';

/* tslint:disable */
declare global {
    interface Window {
        chrome: any;
        __ELM_DEBUG_TRANSFORM_OPTIONS__?: IOptions;
    }
}
/* tslint:enable*/

interface IOptions {
    active?: boolean;
    debug?: boolean;
    simple_mode?: boolean;
    limit?: number;
    theme?: IThemeOption;
}

const defaultOptions: IOptions = {
    active: true,
    debug: false,
    limit: 1000000,
    simple_mode: false,
    theme: "light"
}

export async function parse(message: string) : Promise<IElmDebugValue> {
  const promise = new Promise<IElmDebugValue>((res, rej) => {
    const app = Elm.Parser.init({flags:message});
    app.ports.sendParsed.subscribe(value => {
      res(value as IElmDebugValue );
    })
  });

  return promise;
}

export function register(opts: IOptions | undefined): IOptions {

    if(window.__ELM_DEBUG_TRANSFORM_OPTIONS__){
      return window.__ELM_DEBUG_TRANSFORM_OPTIONS__;
    }
    
    const log = console.log;

    if (opts && opts.theme === undefined) {
      opts.theme = window.matchMedia("(prefers-color-scheme: dark)").matches 
        ? "dark" 
        : "light";
    }

    let currentOpts = _.merge(defaultOptions, opts);

    console.log = async function() {
        if (!currentOpts.active) {
            log.apply(console, arguments as any);
            return;
        }

        if (!arguments || arguments.length > 1) {
            log.apply(console, arguments as any);
            return;
        }
        const msg = arguments[0];

        if (!msg || !currentOpts.limit || msg.length > currentOpts.limit) {
            log.call(console, msg);
            return;
        }

        if (!currentOpts.limit || msg.length > currentOpts.limit) {
            log.call(console, msg);
            return;
        }
        
        const themeStyle = (currentOpts.theme === "dark") 
          ? darkTheme 
          : lightTheme;

        const formatter =
            !!currentOpts.simple_mode 
                ? new SimpleFormatter()
                : new JsonMLFormatter(themeStyle);
        try {
            if (!!currentOpts.debug) {
                log.call(console, 'Original message:', msg);
            }

            const parsed = await parse(msg);
            log.call(console, 'Original message:', msg);

            log.call(
                console,
                JSON.parse(JSON.stringify(formatter.format(parsed)))
            );
        } catch (err) {
            if (!!currentOpts.debug) {
                console.error(`Parsing error: ${err}`);
            }
            log.call(console, msg);
        }
    };

    window.__ELM_DEBUG_TRANSFORM_OPTIONS__ = currentOpts;
    return currentOpts;
}

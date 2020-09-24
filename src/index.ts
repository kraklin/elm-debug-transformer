import * as _ from 'lodash';
import {  IElmDebugValue, IThemeOption } from './CommonTypes';
import { parse } from './elm-debug-parser';
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

    console.log = function() {
        if (!arguments || arguments.length > 1) {
            log.apply(console, arguments);
            return;
        }
        const msg = arguments[0];

        if (!msg || msg.length > opts.limit) {
            log.call(console, msg);
            return;
        }

        if (msg.length > currentOpts.limit) {
            log.call(console, msg);
            return;
        }
        
        const themeStyle = (currentOpts.theme === "dark") 
          ? darkTheme 
          : lightTheme;

        const formatter =
            !!currentOpts.simple_mode || !window.chrome
                ? new SimpleFormatter()
                : new JsonMLFormatter(themeStyle);
        try {
            if (!!currentOpts.debug) {
                log.call(console, 'Original message:', msg);
            }

            const parsed = parse(msg) as IElmDebugValue;

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

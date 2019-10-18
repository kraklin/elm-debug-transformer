import * as _ from 'lodash';
import { IElmDebugValue } from './CommonTypes';
import { parse } from './elm-debug-parser';
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
}

const defaultOptions:  IOptions = {
    active: true,
    debug: false,
    limit: 1000000,
    simple_mode: false,
}

export function register(opts: IOptions | undefined): IOptions {

    if(window.__ELM_DEBUG_TRANSFORM_OPTIONS__){
      return window.__ELM_DEBUG_TRANSFORM_OPTIONS__;
    }
    
    const log = console.log;

    let currentOpts = _.merge(defaultOptions, opts);

    console.log = function() {

        if (!currentOpts) {
          currentOpts = defaultOptions;
        }

        if (!currentOpts.active) {
            log.apply(console, arguments);
            return;
        }

        if (arguments.length > 1) {
            log.apply(console, arguments);
            return;
        }
        const msg = arguments[0];

        if (msg.length > currentOpts.limit) {
            log.call(console, msg);
            return;
        }

        const formatter =
            !!currentOpts.simple_mode || !window.chrome
                ? new SimpleFormatter()
                : new JsonMLFormatter();
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

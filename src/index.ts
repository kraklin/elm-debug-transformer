import * as _ from 'lodash';
import { IElmDebugValue } from './CommonTypes';
import { parse } from './elm-debug-parser';
import JsonMLFormatter from './formatters/JsonMLFormatter';
import SimpleFormatter from './formatters/SimpleFormatter';

/* tslint:disable */
declare global {
    interface Window {
        chrome: any;
    }
}
/* tslint:enable*/

interface IOptions {
  debug?: boolean;
  simple_mode?: boolean;
  limit?: number
}

const defaultOptions:  IOptions = {
    debug: false,
    limit: 100000,
    simple_mode: false,
}

export function register(opts: IOptions | undefined) {
    const log = console.log;

    opts = _.merge(defaultOptions, opts)

    const formatter =
        !!opts.simple_mode || !window.chrome
            ? new SimpleFormatter()
            : new JsonMLFormatter();

    console.log = function() {
        if (arguments.length > 1) {
            log.apply(console, arguments);
            return;
        }
        const msg = arguments[0];

        if (msg.length > opts.limit) {
            log.call(console, msg);
            return;
        }

        try {
            if (!!opts.debug) {
                log.call(console, 'Original message:', msg);
            }

            const parsed = parse(msg) as IElmDebugValue;

            log.call(
                console,
                JSON.parse(JSON.stringify(formatter.format(parsed)))
            );
        } catch (err) {
            if (!!opts.debug) {
                console.error(`Parsing error: ${err}`);
            }
            log.call(console, msg);
        }
    };
}

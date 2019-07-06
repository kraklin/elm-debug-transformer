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

export function register(opts = { simple_mode: false, debug: false }) {
    const log = console.log;

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

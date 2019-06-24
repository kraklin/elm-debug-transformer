import ElmGrammar from '!!raw-loader!./elm-debug.pegjs';
import * as _ from 'lodash';
import * as PegJS from 'pegjs';
import { IElmDebugValue } from './CommonTypes';
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

    const parser = PegJS.generate(ElmGrammar);

    const formatter =
        !!opts.simple_mode || !window.chrome
            ? new SimpleFormatter()
            : new JsonMLFormatter();

    console.log = msg => {
        try {
            if (!!opts.debug) {
                log.call(console, 'Original message:', msg);
            }

            const parsed = parser.parse(msg) as IElmDebugValue;

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

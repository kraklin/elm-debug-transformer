import * as _ from 'lodash';
import * as PegJS from 'pegjs';
import elmGrammar from '!!raw-loader!./elm-debug.pegjs';
import { ElmDebugValue } from './CommonTypes';
import SimpleFormatter from './formatters/SimpleFormatter';
import DevToolsFormatter from './formatters/DevToolsFormatter';

export function register(opts = { simple_mode: false, debug: false }) {
    const _log = console.log;

    const parser = PegJS.generate(elmGrammar);

    const formatter = !!opts.simple_mode
        ? new SimpleFormatter()
        : new DevToolsFormatter();

    console.log = msg => {
        try {
            if (!!opts.debug) {
                _log.call(console, 'Original message:', msg);
            }

            const parsed = parser.parse(msg) as ElmDebugValue;

            _log.call(
                console,
                JSON.parse(JSON.stringify(formatter.format(parsed)))
            );
        } catch (err) {
            if (!!opts.debug) {
                console.error(`Parsing error: ${err}`);
            }
            _log.call(console, msg);
        }
    };
}

import { Elm } from './Main.elm';
import * as ElmDebugger from '../../dist/index.mjs';
//import * as ElmDebugger from 'elm-debug-transformer';

console.log(ElmDebugger);
ElmDebugger.register({simple_mode: false, debug: true, limit: 10000});

Elm.Main.init({
    node: document.getElementById('root'),
});

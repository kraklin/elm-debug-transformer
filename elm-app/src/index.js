import { Elm } from './Main.elm';
import { register } from '../../dist/elm-console-debug.js';

let opts = {simple_mode: false, debug: true, sizeLimit: 1000}

window.elmopts = register(opts);

Elm.Main.init({
    node: document.getElementById('root'),
});

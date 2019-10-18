import './main.css';
import { Elm } from './Main.elm';
import registerServiceWorker from './registerServiceWorker';
import { register } from '../../dist/elm-console-debug.js';

let opts = {simple_mode: false, debug: true, sizeLimit: 1000}

window.elmopts = register(opts);
window.elmopts2 = register(opts);
window.elmopts3 = register(opts);

Elm.Main.init({
    node: document.getElementById('root'),
});

registerServiceWorker();

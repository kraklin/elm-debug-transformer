import './main.css';
import { Elm } from './Main.elm';
import registerServiceWorker from './registerServiceWorker';
import { register } from '../../dist/elm-console-debug.js';

register({simple_mode: false, debug: true});


Elm.Main.init({
  node: document.getElementById('root')
});

registerServiceWorker();

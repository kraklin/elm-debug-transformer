import './main.css';
import { Elm } from './Main.elm';
import registerServiceWorker from './registerServiceWorker';
import * as ElmDebug from '../../src/index.js';


ElmDebug.register();

Elm.Main.init({
  node: document.getElementById('root')
});

console.log("some value");

registerServiceWorker();

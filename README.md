<div align="center">
    <h1>Elm Debug Transformer</h1>
    <a href="https://badge.fury.io/js/elm-debug-transformer">
      <img src="https://badge.fury.io/js/elm-debug-transformer.svg" alt="version">
    </a>
    <p>Transform Elm Debug.log output into nice log object with custom formatters</p>
</div>

The standard Elm `Debug.log` console output:

![Elm Debug.log in console without formatter](img/ugly_output.png)

and the same output with this package 

![Elm Debug.log with this package and custom formatter enabled in Chrome](img/nice_output.png)

The main module exposes `register()` function that replaces your `console.log()` and try to parse each incoming message with Elm parser. If it fails, it would pass the original message.

## Limitations

Right now you can insert only alphabet characters and spaces as a Debug.log tag. 
```
-- this would parse successfuly
Debug.log "Some tag string" thingToPrintToConsole


-- this would NOT BE PARSED
Debug.log "Some String (with non [a-zA-Z] chars or numbers in it) " thingToPrintToConsole
```

This limitation is due to the problem recognizing arbitrary tag text from the rest of the types. I'm aware of that limitation and it is something that would be addressed in the upcoming versions. Thanks for understanding.


## Installation

Just install this module with Yarn:

```
yarn add -D elm-debug-transformer
```

or NPM:

```
npm install elm-debug-transformer
```

### Get it directly from CDN

[Roman Potashow](https://github.com/justgook) pointed out on Elm Slack that you can use the NPM package directly without the need of installing it.

```
<script src="https://unpkg.com/elm-debug-transformer@<VERSION>/dist/elm-console-debug.js"></script>

<script>ElmConsoleDebug.register()</script>
```


## Usage

There is a nice summary of the usage in Alex Korban's article [Get improved Debug.log output in the browser console](https://korban.net/posts/elm/2019-07-02-improved-debug-log-output-browser-console/)

### `register()`
Register the console debugger in your main JS file before you initialize Elm application:

```
import * as ElmDebugger from 'elm-debug-transformer';

ElmDebugger.register();

// rest of application
```

Here's a sample HTML for your reference:
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Elm App</title>
</head>
<body>
  <main></main>
  <script src="https://unpkg.com/elm-debug-transformer@latest/dist/elm-console-debug.js"></script>
  <script>ElmConsoleDebug.register({simple_mode: false, debug: false, limit: 10000});</script>
  <script src="elm.js"></script>
  <script>
    var app = Elm.Main.init({ node: document.querySelector('main') });
  </script>
</body>
</html>
```

### `parse()`
Since version 1.1.0 the parser function is exposed as well, so you can use it to parse Debug.log output into JSON structure and work with it later as you wish.

```
import {parse} ElmDebugger from 'elm-debug-transformer';

const parsedValue = parse("debug tag: [1,2,3]");
```


### Enable custom formatters in Chrome and Firefox dev tools
Available in Chrome 47 and higher and in Firefox 116 and higher.

The output object is kind of chatty right now (it carries information about parsed type etc. - less verbose version is worked on right now). 

If your browser is Firefox 116 and above or if it have have Chrome dev tools, you can enable custom formatters so you get less noise and more nice output.

#### How to enable custom formatters in Chrome:
  - Open DevTools
  - Go to Preferences ("cog wheel" icon in the upper right corner of DevTools > Preferences > Console)
  - Check-in "Enable custom formatters"
  - Close DevTools
  - Open DevTools

#### How to enable custom formatters in Firefox:
  - Open DevTools
  - Go to Settings ("three dots" icon in the upper right corner of DevTools > Settings F1 > Advanced settings)
  - Check-in "Enable custom formatters"
  - Close DevTools
  - Open DevTools

Note: You might need to refresh the page first time you open Console panel with existing logs - custom formatters are applied only to newly printed console messages.

That way the `Debug.log` would output simpler JS object without `type` information. `Tuple`, `Set`, `Array` and `List` would become arrays and `Dict` would become JS object with keys and values.

### Options
Options object can be provided to `register` function:

```
import * as ElmDebugger from 'elm-debug-transformer';

ElmDebugger.register({simple_mode: true, debug: false, limit: 10000});
```

| parameter     | type    | description                                                                                                                               | default value   |
|---------------|---------|-------------------------------------------------------------------------------------------------------------------------------------------|----------------:|
| `limit`       | number  | number of message characters after which the parser won't parse the message. (Helpful for bypass the parsing of large datastructures)     | `1 000 000`     |
| `debug`       | boolean | include original message and parser error with the message                                                                                | `false`         |
| `simple_mode` | boolean | force output to be in simple object format                                                                                                | `false`         |



## Credits

This would probably not see the light of the day without [Matt Zeunert](https://github.com/mattzeunert) and his [blogpost](https://www.mattzeunert.com/2016/02/19/custom-chrome-devtools-object-formatters.html) about writing custom formatters. Thank you!


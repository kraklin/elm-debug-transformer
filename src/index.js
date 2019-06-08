import * as Parser from './parser.js';
import * as _ from 'lodash';

function keyValueLine(key, value) {
  return [
    'div',
    {},
    ['span', { style: 'color: purple; font-weight: bold' }, key],
    ['span', {}, ' = '], value 
  ];
}

function isFinalValue(value) {
  return (_.isString(value) || (value.type == "Number"))
}

function getFinalValue(value) {
  if (_.isString(value) )
    return `"${value}"`;
  else
    return value.value
}

function handleHeader(value, config) {
  if (!value.type || !value.value) {
    return null;
  }

  switch (value.type) {
    case 'ElmDebug':
      const tag = !!value.tag ? value.tag + ': ' : '';

      return tag + handleHeader(value.value, config);
    case 'Record':
      const keys = _.chain(value.value)
        .mapValues((v, k) => {
          return k + ' = ' + handleHeader(v, config);
        })
        .values()
        .value();

      return `{ ${_.truncate(keys.join(', '))} }`;

    case 'String':
      return `"${value.value}"`;

    default:
      return toString(value);
  }
}

function handleBody(value, config) {
  if (!value.type || !value.value) {
    return ['div', {}, 'end'];
  }

  switch (value.type) {
    case 'ElmDebug':
      return ['div', {}, handleBody(value.value, {})];
    case 'Record':
      const values = _.chain(value.value)
        .mapValues((v, k) => {
          if (isFinalValue(v)) {
            return keyValueLine(k, getFinalValue(v));
          }
          return [
            'div',
            {},
            ['object', { object: v, config: { key: k, elmFormat: true } }]
          ];
        })
        .values()
        .value();

      return ['div', {}].concat(values);

    default:
      return ['div', {}, JSON.stringify({ o: {}, v: value })];
  }

  return ['div', {}, 'body'];
}

export function register() {
  const _log = console.log;

  window.devtoolsFormatters = [
    {
      header: function(obj, config) {
        if (
          (!!obj.type && obj.type === 'ElmDebug') ||
          (!!config && config.elmFormat)
        ) {
          if (!!config && !!config.key) {
            return keyValueLine(config.key, handleHeader(obj, config));
          } else {
            return ['div', {}, '(h)', handleHeader(obj, config)];
          }
        } else {
          return null;
        }
      },
      hasBody: function(obj) {
        return true;
      },
      body: function(obj, config) {
        return ['div', {}, '(b)', handleBody(obj, config)];
      }
    }
  ];

  console.log = msg => {
    try {
      const parsed = Parser.parse(msg);
      _log.call(console, JSON.parse(JSON.stringify(parsed)));
      // for debug only
      _log.call(console, parsed.value);
    } catch (err) {
      _log.call(console, msg);
    }
  };
}


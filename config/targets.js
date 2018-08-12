'use strict';

let browsers = [
  'Chrome 66',
];

if (process.env.EMBER_ENV === 'test') {
  browsers = [
    'Chrome 66',
  ];
}

module.exports = { browsers };

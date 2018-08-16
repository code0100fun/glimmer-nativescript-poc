'use strict';

const GlimmerApp = require('@glimmer/application-pipeline').GlimmerApp;
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const insert = require('rollup-plugin-insert');

module.exports = function(defaults) {
  let app = new GlimmerApp(defaults, {
    rollup: {
      plugins: [
        resolve({ jsnext: true, module: true, main: true }),
        commonjs(),
        insert.append(`\n${normalizeValue.toString()}`, {
          include: '**/vm/attributes/dynamic.js'
        }),
      ],
      external(id) {
        return /tns-core-modules/.test(id);
      },
      globals: {
        'tns-core-modules/application': 'tnsApplication',
        'tns-core-modules/ui/frame': 'tnsFrame',
        'tns-core-modules/ui/layouts/layout-base': 'tnsLayoutBase',
        'tns-core-modules/ui/content-view': 'tnsContentView',
        'tns-core-modules/ui/core/view': 'tnsView',
      },
    },
    sassOptions: {
      includePaths: [
        'node_modules',
      ]
    },
  });

  return app.toTree();
};


// The function below gets appended to `glimmer/runtime/lib/vm/attributes/dynamic.js`
// it allows event handlers (ie `onclick={{action handler}}`) to be handled by
// the fake ViewNode#setAttribute rather than trying to set it as a property
// using NewElementBuilder#__newProperty.
function normalizeValue(value) {
  if (value === false || value === undefined || value === null || typeof value.toString === 'undefined') {
      return null;
  }
  if (value === true) {
      return '';
  }
  // onclick function etc in SSR
  if (typeof value === 'function') {
      // HACK!
      // return null;
      return value;
  }
  return String(value);
}

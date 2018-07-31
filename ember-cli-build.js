'use strict';

const GlimmerApp = require('@glimmer/application-pipeline').GlimmerApp;
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');

module.exports = function(defaults) {
  let app = new GlimmerApp(defaults, {
    rollup: {
      external: ['tns-core-modules'],
      plugins: [
        resolve({ jsnext: true, module: true, main: true }),
        commonjs(),
      ],
      external(id) {
        return /tns-core-modules/.test(id);
      },
    }
  });

  return app.toTree();
};

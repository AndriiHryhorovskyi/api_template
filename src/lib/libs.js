'use strict';

const getCommonLibs = () => {
  const timeout = msec =>
    new Promise(resolve => {
      setTimeout(resolve, msec);
    });

  return Object.freeze({ timeout });
};

const libs = { ...getCommonLibs() };
const internals = [
  'util',
  'child_process',
  'worker_threads',
  'os',
  'v8',
  'vm',
  'path',
  'url',
  'assert',
  'querystring',
  'string_decoder',
  'perf_hooks',
  'async_hooks',
  'timers',
  'events',
  'stream',
  'fs',
  'crypto',
  'zlib',
  'dns',
  'net',
  'tls',
  'http',
  'https',
  'http2',
  'dgram',
  './security',
  './validator',
];

// eslint-disable-next-line
for (const path of internals) {
  const chunks = path.split('/');
  const name = chunks[chunks.length - 1];
  // eslint-disable-next-line
  libs[name] = Object.freeze(require(path));
}

libs.process = process;
libs.childProcess = libs.child_process;
libs.StringDecoder = libs.string_decoder;
libs.perfHooks = libs.perf_hooks;
libs.asyncHooks = libs.async_hooks;
libs.worker = libs.worker_threads;
libs.fsp = libs.fs.promises;

module.exports = Object.freeze(libs);

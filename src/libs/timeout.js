'use strict';

/**
 * Resolves after some time
 * @param {Number} msec - time in milliseconds
 * @return {Promise<undefined>}
 */
module.exports = (msec = 0) =>
  new Promise(resolve => setTimeout(resolve, msec));

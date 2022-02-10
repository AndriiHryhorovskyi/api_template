'use strict';

const {
  Types: { ObjectId },
} = require('mongoose');
const jwt = require('jsonwebtoken');
const { SESSION } = require('../config');

const issueToken = (jwtPayload, secret, options = {}) =>
  new Promise((resolve, reject) => {
    if (typeof jwtPayload !== 'object' || Array.isArray(jwtPayload))
      return reject(new Error('Invalid jwt payload!'));
    if (!secret) return reject(new Error('Parameter "secret" is requred!'));
    jwt.sign(jwtPayload, secret, options, (err, token) =>
      err ? reject(err) : resolve(token),
    );
    return null;
  });

const issueTokenSync = (jwtPayload, secret, options = {}) => {
  // eslint-disable-next-line
  if (typeof jwtPayload !== 'object' || Array.isArray(jwtPayload))
    throw new Error('Invalid jwt payload!');
  if (!secret) throw new Error('Parameter "secret" is requred!');
  return jwt.sign(jwtPayload, secret, options);
};

const verifyToken = (token, secret) =>
  new Promise((resolve, reject) => {
    if (!token || !secret) return reject(new Error('Both params are required'));
    jwt.verify(token, secret, (error, decodedData) => {
      if (error) return reject(error);
      return resolve(decodedData);
    });
    return null;
  });

const accessToken = {
  /**
   * Generate access token
   * @param {Object} jwtPayload - jwt body
   * @param {Object} options - jwt options
   * @return {Promise<String>} Token
   */
  issueToken: (jwtPayload, options = {}) =>
    issueToken(
      jwtPayload,
      SESSION.SECRET,
      SESSION.EXP ? { expiresIn: SESSION.EXP, ...options } : options,
    ),

  /**
   * Generate access token
   * @param {Object} jwtPayload - jwt body
   * @param {Object} options - jwt options
   * @return {String} Token
   */
  issueTokenSync: (jwtPayload, options = {}) =>
    issueTokenSync(
      jwtPayload,
      SESSION.SECRET,
      SESSION.EXP ? { expiresIn: SESSION.EXP, ...options } : options,
    ),

  /**
   * Verify access token
   * @param {String} token - Access token
   * @return {Promise<Object>} Token payload
   */
  verify: token => verifyToken(token, SESSION.SECRET),
};

const refreshToken = {
  /**
   * Generate refresh token
   * @return {String} Token
   */
  issueToken: () => Promise.resolve(ObjectId().toString()),
};

/**
 * Generate token pair
 * @param {Object} jwtPayload - Access token payload
 * @param {Object} options - Jwt options
 * @return {Promise<Object>} {accessToken, refreshToken}
 */
const issueTokenPair = async (jwtPayload, options = {}) => {
  const aToken = await accessToken.issueToken(jwtPayload, options);
  const rToken = await refreshToken.issueToken();
  return { accessToken: aToken, refreshToken: rToken };
};

module.exports = {
  accessToken,
  refreshToken,
  issueTokenPair,
};

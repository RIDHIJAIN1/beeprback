const httpStatus = require('http-status');
const tokenService = require('./token.service');
const userService = require('./user.service');
const Token = require('../models/token.model');
const ApiError = require('../utils/ApiError');
const { tokenTypes } = require('../config/tokens');

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await userService.getUserByEmail(email);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  return user;
};

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise}
 */
const logout = async (refreshToken) => {
  const refreshTokenDoc = await Token.findOne({ token: refreshToken, type: tokenTypes.REFRESH, blacklisted: false });
  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
  await refreshTokenDoc.remove();
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async (refreshToken) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(refreshToken, tokenTypes.REFRESH);
    const user = await userService.getUserById(refreshTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await refreshTokenDoc.remove();
    return tokenService.generateAuthTokens(user);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
};

/**
 * Reset password
 * @param {string} otp
 * @param {string} email
 * @param {string} newPassword
 * @returns {Promise}
 */
const resetPassword = async (otp, email, newPassword) => {
    const user = await userService.getUserByEmail(email);
    if (!user) throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid user!');
    await tokenService.verifyOtp(otp, user, tokenTypes.RESET_PASSWORD);
    await userService.updateUserById(user.id, { password: newPassword });
    await Token.deleteMany({ user: user.id, type: tokenTypes.RESET_PASSWORD });
};

/**
 * Verify email
 * @param {string} otp
 * @param {string} email
 * @returns {Promise}
 */
const verifyEmail = async (otp, email) => {
  const user = await userService.getUserByEmail(email);
  if (!user) throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid user email!');
  await tokenService.verifyOtp(otp, user, tokenTypes.VERIFY_EMAIL);
  await userService.updateUserById(user.id, { isEmailVerified: true });
  await Token.deleteMany({ user: user.id, type: tokenTypes.VERIFY_EMAIL });
};

module.exports = {
  loginUserWithEmailAndPassword,
  logout,
  refreshAuth,
  resetPassword,
  verifyEmail,
};

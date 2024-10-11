

const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService, emailService } = require('../services');
const Seller = require('../models/seller.model');
const Message = require('../models/message.model');

const register = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  const tokens = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.CREATED).send({ data: { user, tokens }, status: true });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  let user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.OK).send({ data: { user, tokens }, status: true });
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send({ status: true });
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ data: { ...tokens }, status: true });
});

const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(res, req.body.email);
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res.status(httpStatus.OK).send({ status: true, message: "OTP sent on mail successfully!" });
});

const resetPassword = catchAsync(async (req, res) => {
  try {
    await authService.resetPassword(req.body.otp, req.body.email, req.body.password);
    res.status(httpStatus.OK).send({ status: true });
  } catch (error) {
    res.status(httpStatus.BAD_REQUEST).json({
      status: false,
      message: error.message || 'Password reset failed!',
    });
  }
});

const sendVerificationEmail = catchAsync(async (req, res) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user);
  await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
  res.status(httpStatus.NO_CONTENT).send({ status: true, message: "Password reset successfully!" });
});

const getUserFromToken = catchAsync(async (req, res) => {
  // Extract the user from token
  if (req.user.role == 'seller') {
    const seller = await Seller.findOne({ userId: req.user._id });
    if (!seller) {
      return res.status(httpStatus.OK).send(req.user);
    } else {
      const message = await Message.findOne({ sellerId: seller._id });
      if (message) {
        return res.status(httpStatus.OK).send({ ...req.user._doc, ...seller._doc, ...message._doc });
      }
      return res.status(httpStatus.OK).send({ ...req.user._doc, ...seller._doc });
    }
  }
  return res.status(httpStatus.OK).send({ data: req.user, status: true });
});

const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.query.token);
  res.status(httpStatus.NO_CONTENT).send({ status: true });
});

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  getUserFromToken,
  verifyEmail,
};
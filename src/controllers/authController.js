import db from "../models/index.js";
import jwt from "jsonwebtoken";
import { catchAsync } from "../utils/catchAsync.js";
import { AppError } from "../utils/AppError.js";
import { NodeEnv } from "../constants/index.js";
/**
 * @typedef {ReturnType<typeof import('../models/user.js').default>} User
 */

/**
 * @type {{User: User}}
 */
const { User } = db;

const getAccessToken = (id) => {
  const accessToken = jwt.sign({ id }, process.env.ACCESS_JWT_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_JWT_TOKEN_EXPIRES_IN,
  });
  return accessToken;
};

const getRefreshAndAccessTokens = (id) => {
  const accessToken = getAccessToken(id);
  const refreshToken = jwt.sign({ id }, process.env.REFRESH_JWT_TOKEN_SECRET, {
    expiresIn: `${process.env.REFRESH_JWT_TOKEN_EXPIRES_IN}d`,
  });
  const refreshTokenCookieOptions = {
    expires: new Date(
      Date.now() +
        Number(process.env.REFRESH_JWT_TOKEN_EXPIRES_IN) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === NodeEnv.prod)
    refreshTokenCookieOptions.secure = true;

  return { accessToken, refreshToken, refreshTokenCookieOptions };
};

const createSendTokens = (user, statusCode, res) => {
  const { accessToken, refreshToken, refreshTokenCookieOptions } =
    getRefreshAndAccessTokens(user.id);

  res.cookie("jwt", refreshToken, refreshTokenCookieOptions);

  // Remove password from output
  user.password = "";

  res.status(statusCode).json({
    status: "success",
    token: accessToken,
    data: {
      user,
    },
  });
};

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }
  // 2) Check if user exists && password is correct
  const user = await User.findOne({ where: { email } });

  if (!user || !user.validatePassword(password, user.password)) {
    return next(new AppError("Incorrect email or password", 401));
  }

  // 3) If everything ok, send token to client
  createSendTokens(user, 200, res);
});

const register = catchAsync(async (req, res, next) => {
  const { email, userName, password, confirmPassword } = req.body;
  if (password != confirmPassword) {
    return next(
      new AppError("password and confirmPassword are not the same!", 401)
    );
  }
  const newUser = await User.create({
    email,
    userName,
    password,
  });

  createSendTokens(newUser, 201, res);
});

const refresh = (req, res, next) => {
  if (req.cookies?.jwt) {
    // Destructuring refreshToken from cookie
    const refreshToken = req.cookies.jwt;

    // Verifying refresh token
    jwt.verify(
      refreshToken,
      process.env.REFRESH_JWT_TOKEN_SECRET,
      (err, decoded) => {
        const { id } = decoded;
        if (err) {
          // Wrong Refesh Token
          return next(new AppError("Invalid token. Please log in again!", 401));
        } else {
          // Correct token we send a new access token
          const accessToken = getAccessToken(id);
          return res.json({ accessToken });
        }
      }
    );
  } else {
    return next(new AppError("Invalid token. Please log in again!", 401));
  }
};
export { login, register, refresh };

import db from "../models/index.js";
import { AppError } from "../utils/AppError.js";
import { catchAsync } from "../utils/catchAsync.js";
/**
 * @typedef {ReturnType<typeof import('../models/user.js').default>} User
 */

/**
 * @type {{User: User}}
 */
const { User } = db;

const getUsers = catchAsync(async (req, res, next) => {
  const users = await User.findAll({});

  res.status(200).json({
    status: "success",
    data: { users },
  });
});

const getUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findOne({ where: { id } });
  if (!user) {
    return next(new AppError(`No user found with ID: "${id}"`, 404));
  }
  res.status(200).json({
    status: "success",
    data: { user },
  });
});

const createUser = catchAsync(async (req, res, next) => {
  const { email, userName, password } = req.body;
  const newUser = await User.create({ email, userName, password });
  res.status(201).json({
    status: "success",
    data: { newUser },
  });
});

const updateUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { email, userName, password } = req.body;

  const numOfModifiedRecords = await User.update(
    { email, userName, password },
    {
      where: { id },
      individualHooks: true,
    }
  );

  if (!numOfModifiedRecords) {
    return next(new AppError(`No user found with ID: "${id}"`, 404));
  }

  res.status(200).json({
    status: "success",
    data: { numOfModifiedRecords },
  });
});

const deleteUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const numOfModifiedRecords = await User.destroy({
    where: { id },
  });

  if (!numOfModifiedRecords) {
    return next(new AppError(`No user found with ID: "${id}"`, 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

export { getUsers, getUser, createUser, updateUser, deleteUser };

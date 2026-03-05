import User from "../models/user.model.js";
import { StatusCodes } from "http-status-codes";

export const registerUser = async (req, res, next) => {
  try {
    const { fullName, email, password, accountNumber } = req.body;

    const user = await User.create({
      fullName,
      email,
      password,
      accountNumber,
    });

    return res.status(StatusCodes.CREATED).json({
      message: "User registered successfully",
      data: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        accountNumber: user.accountNumber,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      throw createError(StatusCodes.UNAUTHORIZED, "Invalid email or password");
    }

    return res.status(StatusCodes.OK).json({
      message: "Login successful",
      data: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        accountNumber: user.accountNumber,
      },
    });
  } catch (error) {
    next(error);
  }
};

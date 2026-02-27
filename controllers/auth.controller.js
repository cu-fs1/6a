import User from "../models/user.model.js";

export const registerUser = async (req, res, next) => {
  try {
    const { fullName, email, password, accountNumber } = req.body;

    const user = await User.create({
      fullName,
      email,
      password,
      accountNumber,
    });

    return res.status(201).json({
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
      return res.status(401).json({ message: "Invalid email or password" });
    }

    return res.status(200).json({
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

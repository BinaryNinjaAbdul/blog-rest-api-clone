import { promisify } from "util";
import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import validator from "validator";
import jwt from "jsonwebtoken";
import User from "../model/userModel";
import AppError from "../utils/appError";

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let { firstName, lastName, email, password, confirmPassword } = req.body;

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      return next(
        new AppError(
          "A user must have an firstName, lastName, email, password, confirmPassword",
          401
        )
      );
    }

    if (!validator.isEmail(email)) {
      return next(
        new AppError("Please enter a valid email address to continue", 401)
      );
    }

    const user = await User.findOne({ email });
    if (user !== null) {
      return next(
        new AppError(
          "Already a registered email address, please try another one",
          401
        )
      );
    }

    if (!validator.isStrongPassword(password)) {
      return next(
        new AppError(
          "A passowrd must contain 1 Capital Letter, 1 Lowercase Letter, 1 Number and 1 special character",
          401
        )
      );
    }

    if (password !== confirmPassword) {
      return next(new AppError("Confirm password did not matched", 401));
    }

    password = await bcrypt.hash(password, 12);

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password,
    });

    return res.status(200).json({
      status: "success",
      message: "You are successfully registered",
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
    });
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      status: "fail",
      message: "Error while creating new user",
      error,
    });
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError("Please provide email and password", 401));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(new AppError("Invalid email or password", 401));
    }

    const isTruePassword = await bcrypt.compare(password, user.password);
    if (!isTruePassword) {
      return next(new AppError("Invalid email or password", 401));
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });

    return res.status(200).json({
      status: "success",
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      status: "fail",
      error,
    });
  }
};

const verifyUser = async (decoded, next: NextFunction) => {
  try {
    const user = await User.findById(decoded.id);
    if (user === null) {
      return next(new AppError("No user found! Please try to login", 401));
    }
    console.log(user);
    if (Date.now() < user.updatedAt.getTime()) {
      return next(new AppError("Please login again to conitnue", 401));
    }
    next();
  } catch (error) {
    console.log(error);
  }
};

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let token: string;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(
        new AppError("You are not loggen in please log in to continue", 401)
      );
    }

    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    if (decoded === null) {
      return next(
        new AppError(
          "Inavalid token please try to log in again and continue",
          401
        )
      );
    }
    verifyUser(decoded, next);
  } catch (error) {
    return next(
      new AppError(
        "Inavalid token please try to log in again and continue",
        401
      )
    );
  }
};

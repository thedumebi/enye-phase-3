const asyncHandler = require("express-async-handler");
const generateToken = require("../utils/generateToken.utils");
const User = require("../models/users.model");

// @desc Auth user & get token
// @route POST /api/users/login
// @access Public
const authUser = asyncHandler(async (req, res) => {
  const { input, password } = req.body;
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  const usernameRegex = /^[a-zA-Z][\w-]+$|^@[a-zA-Z0-9]*/;
  let criteria;
  if (emailRegex.test(input)) {
    criteria = { email: input };
  } else if (usernameRegex.test(input)) {
    if (input.startsWith("@")) {
      criteria = {
        username: {
          $regex: new RegExp(`^${input.slice(1, input.length + 1)}$`),
          $options: "i",
        },
      };
    } else {
      criteria = {
        username: { $regex: new RegExp(`^${input}$`), $options: "i" },
      };
    }
  } else {
    criteria = { email: null };
  }

  const user = await User.findOne(criteria);

  if (user) {
    if (await user.matchPassword(password)) {
      const { password, ...otherKeys } = user._doc;
      res.status(200).json({
        ...otherKeys,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error("Invalid password");
    }
  } else {
    if (criteria.email) {
      res.status(401);
      throw new Error("Invalid email");
    } else if (criteria.username) {
      res.status(401);
      throw new Error("Invalid username");
    } else {
      res.status(401);
      throw new Error("No valid input");
    }
  }
});

// @desc Register a new user
// @route POST /api/users/
// @access Public
const registerUser = asyncHandler(async (req, res) => {
  const { fname, lname, phoneNumber, email, username, password } = req.body;

  const [lastUser] = await User.find().sort({ created_at: -1 }).exec();
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }
  const users = await User.find();
  users.map((user) => {
    if (user.username.toLowerCase() === req.body.username.toLowerCase()) {
      res.status(400);
      throw new Error("Sorry, that username is taken");
    }
  });

  const user = await User.create({
    id: lastUser ? lastUser.id + 1 : 1,
    name: `${fname} ${lname}`,
    email,
    password,
    username,
    phoneNumber,
    created_at: Date.now(),
  });

  if (user) {
    const newUser = await User.findById(user._id).select("-password");
    res.status(200).json({
      ...newUser._doc,
      token: generateToken(newUser._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc Get user profile
// @route GET /api/users/:id || GET /api/users/profile
// @access Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc Update user profile
// @route PATCH /api/user/:id || PATCH /api/user/profile
// @access Private
const updateProfile = asyncHandler(async (req, res) => {
  const usernameExists = await User.findOne({
    username: { $regex: new RegExp(`^${req.body.username}$`), $options: "i" },
  });
  if (usernameExists) {
    res.status(400);
    throw new Error("Sorry, that username is taken");
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true }
  );

  if (user) {
    const { password, ...otherKeys } = user._doc;
    res.status(200).json({
      ...otherKeys,
      token: generateToken(user._id),
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort({ created_at: -1 });
  res.status(200).json(users);
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    await user.remove();
    res.status(200).json({ message: "User removed" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

module.exports = {
  authUser,
  registerUser,
  getUserProfile,
  updateProfile,
  getUsers,
  deleteUser,
};

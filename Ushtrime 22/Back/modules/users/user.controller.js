import { sendWelcomeEmail } from "../../config/ermalService.js";
import User from "./user.model.js";
import bcrypt from "bcrypt";

export const createUser = async (req, res) => {
  try {
    // const firstName = req.body.firstName
    // const lastName = req.body.lastName
    // const email = req.body.email
    // const phoneNumber = req.body.phoneNumber
    // const role = req.body.role
    const { firstName, lastName, email, phoneNumber, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phoneNumber,
      // role,
    });
    await user.save();
    sendWelcomeEmail(user.email, user.firstName);
    res.status(201).json(user);
  } catch (error) {
    console.log(error, "erroridsf");
    res.status(400).json({ message: error });
  }
};

// Get all users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({
      createdAt: -1,
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "server error", error: error });
  }
};

// Get single user
export const getUserById = async (req, res) => {
  try {
    console.log(req.params.id, "req.params.id");
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error });
  }
};

// Update User
export const updateUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    const { firstName, lastName, email, phoneNumber, password } = req.body;
    let role = req.body.role;
    const userRole = req.user.role;
    if (userRole === "user") {
      role = "user";
    } else if (userRole === "moderator") {
      if (req.body.role === "admin") {
        return res
          .status(400)
          .json({ message: "Cannot create this user level" });
      }
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (firstName) {
      user.firstName = firstName;
    }
    if (lastName) {
      user.lastName = lastName;
    }
    if (email) {
      user.email = email;
    }

    if (phoneNumber) {
      user.phoneNumber = phoneNumber;
    }

    if (role) {
      user.role = role;
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }
    await user.save();
    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error });
  }
};
// Delete User
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: "User delted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error });
  }
};
// Delete me
export const deleteMe = async (req, res) => {
  try {
    const userId = req.user.id;
    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: "User delted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error });
  }
};

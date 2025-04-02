import { Request, Response } from "express";
import { validate } from "../../public/validation";
import { UserAdmin } from "../../model/userAdminModel";
import { generateToken } from "../../utils/jwt";
import bcrypt from "bcrypt";


const validateInput = (field: string, value: string, res: Response): boolean => {
  const validation = validate(field, value);
  if (!validation.isValid) {
    res.status(400).json({ status: false, message: validation.message });
    return false;
  }
  return true;
};

export const SignUp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    if (
      !validateInput("name", name, res) ||
      !validateInput("email", email, res) ||
      !validateInput("password", password, res)
    ) return;

    const existingUser = await UserAdmin.findOne({ email, role: "user" });
    if (existingUser) {
      res.status(409).json({ status: false, message: "User already exists" });
      return;
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new UserAdmin({
      name,
      email,
      password: hashedPassword,
      role: "user",
    });

    await newUser.save();

    res.status(201).json({ status: true, message: "User registered successfully" });

  } catch (error) {
    console.error("Error in SignUp:", error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};


export const LogIn = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (
      !validateInput("email", email, res) ||
      !validateInput("password", password, res)
    ) return;

    const user = await UserAdmin.findOne({ email, role: "user" });
    if (!user) {
      res.status(404).json({ status: false, message: "User Not Found" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ status: false, message: "Invalid Password" });
      return;
    }

    const userDetails = {
      name:user.name,
      email : user.email,
      image :user.image,
      userID : user._id
    }
    const token = generateToken(user._id.toString());

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", 
      sameSite: "strict",
    });

    res.status(200).json({ status: true, message: "Login successful" ,userDetails,token});

  } catch (error) {
    console.error("Error in LogIn:", error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};

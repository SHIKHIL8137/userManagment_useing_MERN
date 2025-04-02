import { Schema, model } from "mongoose";

const userAdminSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String, 
      required: true, 
      enum: ["user", "admin"], 
      default: "user",
    },
    image:{
      type:String,
      default :""
    }
  },
  { timestamps: true }
);

export const UserAdmin = model("UserAdmin", userAdminSchema);

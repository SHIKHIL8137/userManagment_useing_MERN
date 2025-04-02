import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinaryConfig"; // Import Cloudinary config

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "users", // ✅ Correctly placed inside the object
    format: "png", // ✅ Directly assigning a format
    public_id: Date.now() + "-" + file.originalname, // ✅ Unique filename
  }),
});

export const upload = multer({ storage });

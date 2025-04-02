import express from "express";
import cors from 'cors'
import dotenv from "dotenv";
import userRoute from './routes/user/user'
import { connectDB } from "./config/db";
import adminRoute from './routes/admin/admin'
import cookieParser from "cookie-parser";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin:"http://localhost:3001", 
  credentials: true
}))
app.use(express.json());
app.use(cookieParser()); 
app.use(express.urlencoded({extended:true}));

app.use('/',userRoute);
app.use('/admin',adminRoute);

connectDB();
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

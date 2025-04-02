
import express,{ Request, Response } from 'express';
import { Home } from '../../controllers/user/userHome';
import { LogIn, SignUp } from '../../controllers/user/userAuth';
import { updatePassword, userUpdate } from '../../controllers/user/userProfileManagment';
import { upload } from '../../config/multer';
import { authenticateJWT } from '../../middleware/authUser';
const route = express.Router();


route.get("/",Home);
route.post("/signUp",SignUp);
route.post('/logIn',LogIn);
route.patch("/updateUser",authenticateJWT,upload.single("image"), userUpdate);
route.patch('/updatePassword',authenticateJWT,updatePassword);

export default route
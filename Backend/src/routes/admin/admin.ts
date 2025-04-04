
import express from 'express';
import { getUserData,  Home } from '../../controllers/admin/adminHome';
import { LogIn, SignUp } from '../../controllers/admin/adminAuth';
import { userDelete, userUpdate ,addUser} from '../../controllers/admin/userManagment';
import { authenticateJWT } from '../../middleware/authUser';

const route = express.Router();



route.get('/getUserData',authenticateJWT,getUserData);
route.post("/signUp",SignUp);
route.post('/logIn',LogIn);
route.delete('/deleteUser/:id',authenticateJWT,userDelete);
route.patch('/updateUser/:id',authenticateJWT,userUpdate);
route.post('/addUser',authenticateJWT,addUser);

export default route
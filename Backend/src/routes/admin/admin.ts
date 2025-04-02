
import express from 'express';
import { getUserData,  Home } from '../../controllers/admin/adminHome';
import { LogIn, SignUp } from '../../controllers/admin/adminAuth';
import { userDelete, userUpdate ,addUser} from '../../controllers/admin/userManagment';
import { authenticateJWT } from '../../middleware/authUser';
import { preventAuthPages } from '../../middleware/authValidateUser';

const route = express.Router();



route.get('/getUserData',getUserData);
route.post("/signUp",SignUp);
route.post('/logIn',LogIn);
route.delete('/deleteUser/:id',userDelete);
route.patch('/updateUser/:id',userUpdate);
route.post('/addUser',addUser);

export default route
const express = require ("express")
const router =  express.Router()

const userController = require("../controller/user")
const middleware = require("../middleware/middleware")

router.post('/register', userController.postUsers);

router.post('/login', userController.login);

router.post('/forgetpassword', userController.forgetPassword);

router.post('/resetpassword', userController.resetpassword);
router.get('/profile', middleware.authentication, userController.profile);


module.exports = router;
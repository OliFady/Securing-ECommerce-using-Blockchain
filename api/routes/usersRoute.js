const express = require("express");
const userControllers = require("./../controllers/userControllers");
const authController = require("./../controllers/authController");

const router = express.Router();

router.post('/signup',authController.signup);
router.post('/login',authController.login);
router.post('/forgetPassword',authController.forgetPassword);
router.patch('/resetPassword/:token',authController.resetPassword);
router.patch('/updatePassword',authController.protect,authController.updatePassword);
router.patch('/updateData',authController.protect,userControllers.updateData);
router.delete('/deleteData',authController.protect,userControllers.deleteData);

router
    .route("/")
    .get(userControllers.getAllUsers)
    .post(userControllers.createUser);

router
    .route("/:id")
    .get(userControllers.getSingleUser)
    .patch(userControllers.updateUser)
    .delete(userControllers.deleteUser);

module.exports = router;

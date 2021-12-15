const router = require("express").Router();
const userController = require("../controllers/userController")
const verify = require("../middleware/auth")
//User register
router.post("/register",userController.create)
//User login to get JWT token
router.get("/login",userController.login)
//Update user data
router.put("/update/:id",verify,userController.edit)
//Delete user data
router.delete("/delete/:id",verify,userController.delete)
//Get all user details
router.get("/views",userController.view)

module.exports = router;
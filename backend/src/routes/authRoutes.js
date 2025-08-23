const express = require("express");
const {
  register,
  login,
  logout,
  getCurrentUser,
} = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  registerValidation,
  loginValidation,
} = require("../validators/authValidator");
const {
  handleValidationErrors,
} = require("../middlewares/validationMiddleware");

const router = express.Router();

//register
router.post("/register", registerValidation, handleValidationErrors, register);
//login
router.post("/login", loginValidation, handleValidationErrors, login);
//logout
router.post("/logout", logout);
//currentuser
router.get("/me", authMiddleware, getCurrentUser);

module.exports = router;

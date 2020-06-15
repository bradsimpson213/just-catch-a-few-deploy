const express = require('express');
const bcrypt = require('bcryptjs');
const { check } = require("express-validator");
const { User } = require("../db/models");
const { getUserToken } = require("../auth");
const { asyncHandler, handleValidationErrors } = require("../utils");

const router = express.Router()

const validateEmail = [
  check("email")
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage("Please provide a valid email."),
  handleValidationErrors,
];

const validateUserNameAndPassword = [
  check("userName")
    .exists({ checkFalsy: true })
    .withMessage("Please provide your user name"),
  check("password")
    .exists({ checkFalsy: true })
    .withMessage("Please provide a password."),
  handleValidationErrors,
];

//CREATE BEW USER ROUTE
router.post(
  "/",
  validateEmail,
  validateUserNameAndPassword,
  asyncHandler(async (req, res, next) => {    
    const { userName, email, password, avatar } = req.body; 
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ userName, email, hashedPassword, avatar });

    console.log(`User: ${userName} created with Avatar #${avatar}`);
    const token = getUserToken(user);
    res
      .status(201)
      .json({ token, user: { id: user.id, userName } });
   })
);

//USER LOGIN ROUTE
router.post(
  "/token",
  validateUserNameAndPassword,
  asyncHandler(async (req, res, next) => {

    const { userName, password } = req.body;
    const user = await User.findOne({
      where: { userName },
    });
    
    if (!user || !user.validatePassword(password)) {
      const err = new Error("Login failed");
      err.status = 401;
      err.title = "Login failed";
      err.errors = ["The provided credentials were invalid."];
      return next(err);
    }
    
    console.log(`User ${user.userName} logged in!`);
    const token = getUserToken(user);
    res.json({ token, user: { userName, wins: user.wins, losses:user.losses, avatar: user.avatar } });
  })
);  

module.exports = router;

var express = require("express");
var router = express.Router();
const { check, validationResult } = require("express-validator");
const {
  signout,
  signup,
  signin,
  isSignedIn,
} = require("../controllers/auth.js");

router.post(
  "/signup",
  [
    // middlewares
    check("name")
      .isLength({ min: 3 })
      .withMessage("name should be at least 3 char long"),
    check("email").isEmail().withMessage("email is required"),
    check("password")
      .isLength({ min: 5 })
      .withMessage("password should be atleast 5 chars long"),
  ],
  signup
);

router.post(
  "/signin",
  [
    check("email")
      .isEmail()
      .withMessage("enter the email and email is required to login"),
    check("password")
      .isLength({ min: 5 })
      .withMessage("password field is required")
      .isLength({ min: 1 }),
  ],
  signin
);

router.get("/signout", signout);

router.get("/testroute", isSignedIn, (req, res) => {
  res.json(req.auth);
  // res.send("A protected route");
});

module.exports = router;

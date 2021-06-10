const User = require("../models/user");
const { check, body, validationResult } = require("express-validator");
// token imports
var jwt = require("jsonwebtoken");
var expressJwt = require("express-jwt");


exports.signup = (req, res) => {
  console.log("REQ BODY", req.body);

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }

  // creating a new user using the model User
  const user = new User(req.body); // saving the user to db
  user.save((err, user) => {
    // if err occurs while saving the user to db we throw an error
    if (err) {
      return res.status(400).json({
        err: "Not able to save user in db",
      });
    }
    // if there are no errors we are just returning the some user data as a response
    // res.json(user);
    res.json({
      name: user.name,
      email: user.email,
      id: user._id,
    });
  });
};

exports.signin = (req, res) => {
  const { email, password } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }

  User.findOne({ email }, (err, user) => {
    // checking if the email is present in the db or not
    if (err || !user) {
      return res.status(400).json({
        error: "USER EMAIL DOES NOT EXIST",
      });
    }
    // if the email is present then lets check whether the password is correct or not
    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: "EMAIL AND PASSWORD DOES NOT MATCH CHECK THE PSWD AGAIN",
      });
    }

    // if the control gets here then the user entered email and pswd correctly then we have to store the user token in his browser

    // create token
    const token = jwt.sign({ _id: user._id }, process.env.SECRET);

    // put the token in cookie
    res.cookie("token", token, { expire: new Date() + 9999 });

    // then send some response to front end
    const { _id, name, email, role } = user;
    return res.json({ token, user: { _id, name, email, role } });
  });
};

exports.signout = (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "User signout succesfully",
  });
};


// protected routes
exports.isSignedIn = expressJwt({
  secret: process.env.SECRET,
  userProperty: "auth",
});


// custom middlewares

exports.isAuthenticated = (req, res, next) => {
  // here the "profile" property is set through the frontend
  let checker = req.profile && req.auth && req.profile._id == req.auth._id;

  if (!checker) {
    return res.status(403).json({
      error: "ACCESS DENIED",
    });
  }
  next();
};
exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(403).json({
      error: "YOU ARE NOT THE ADMIN, ACCESS DENIED",
    });
  }
  next();
};

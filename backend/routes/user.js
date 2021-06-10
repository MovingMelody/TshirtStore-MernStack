var express = require("express");
var router = express.Router();
const {
  getUser,
  getUserById,
  updateUser,
  userPurchaseList,
} = require("../controllers/user");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");

// the below param will be automatically called when the request contains :userId
router.param("userId", getUserById); // here getUserById will populate the profile object if everything goes ok see the user controller file

// to get the user observe we are using params here
router.get("/user/:userId", isSignedIn, isAuthenticated, getUser);

// to update the user
router.put("/user/:userId", isSignedIn, isAuthenticated, updateUser);

// to get the user purchase list
router.get(
  "/orders/user/:userId",
  isSignedIn,
  isAuthenticated,
  userPurchaseList
); 

// assignment -> done successfully
// router.get("/users", getAllUsers);

module.exports = router;

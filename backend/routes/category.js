const express = require("express");
const router = express.Router();
// bring controllers
const {
  getCategoryById,
  createCategory,
  getCategory,
  getAllCategory,
  updateCategory,
  removeCategory,
} = require("../controllers/category");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { getUserById } = require("../controllers/user");

// param extractors
router.param("userId", getUserById);
router.param("categoryId", getCategoryById);

//  actual routes from here
// to create the new category (only admins should be allowed to create the category)
// CREATE ROUTE
router.post(
  "/category/create/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  createCategory
);

// READ ROUTES
// to get the particular category using its id
router.get("/category/:categoryId", getCategory);
// to get all the available categories
router.get("/allcategories", getAllCategory);


// UPDATE ROUTES
router.put(
  "/category/:categoryId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  updateCategory
);

// DELETE ROUTES
router.delete(
  "/category/:categoryId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  removeCategory
);

module.exports = router;

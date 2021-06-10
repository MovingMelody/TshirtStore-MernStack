const express = require("express");
const router = express.Router();
// controllers
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { getUserById } = require("../controllers/user");
const {
  getProductById,
  createProduct,
  getProduct,
  photo,
  deleteProduct,
  updateProduct,
  getAllProducts,
  getAllUniqueCategories,
} = require("../controllers/product");

// params
router.param("userId", getUserById);
router.param("productId", getProductById);

// ACTUAL ROUTES
router.post(
  "/product/create/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  createProduct
);

// get product route
router.get("/product/:productId", getProduct);
router.get("/product/photo/:productId", photo);

// delete product route
router.delete(
  "/product/:productId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  deleteProduct
);

// update product rroute
router.put(
  "/product/:productId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  updateProduct
);

// listing all items route
router.get("/products", getAllProducts);

// to list all the available categories in the admin panel to show the drop down list of categories
// so admin/user can select one of them to create a product under that category
router.get("/products/categories", getAllUniqueCategories);

module.exports = router;

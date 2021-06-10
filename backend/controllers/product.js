const Product = require("../models/product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs"); // file system

// param or middleware
exports.getProductById = (req, res, next, id) => {
  Product.findById(id)
    .populate("category")
    .exec((err, foundProduct) => {
      if (err) {
        return res.status(400).json({
          error: "can't get the product / product not found",
        });
      }
      req.product = foundProduct; // populating the product to use later
      next();
    });
};

// to create a new product
exports.createProduct = (req, res) => {
  //  Create product
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return rs.status(400).json({
        error: "problem with image",
      });
    }

    //TODO: destructure the fields that are coming
    const { name, description, price, category, stock } = fields;
    // adding restrictions on field
    if (!name || !description || !price || !category || !stock) {
      return res.status(400).json({
        error: "Please include all the fields to create the product",
      });
    }
    // if everything goes okay till now we are simply creating product to save into the db
    let product = new Product(fields);

    // handle the file here
    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          error: "File size too big!",
        });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }

    // save to the DB
    product.save((err, savedProduct) => {
      if (err) {
        res.status(400).json({
          error: "Saving tshirt in DB failed",
        });
      }
      res.json(savedProduct);
    });
  });
};

// middleware
// to get the single product -> remember we have already populated the product object through the middleware
exports.getProduct = (req, res) => {
  req.product.photo = undefined;
  return res.json(req.product);
};

exports.photo = (req, res, next) => {
  if (req.product.photo.data) {
    res.set("Content-Type", req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }
  next();
};

// delete controller
// delete the product -> shirt
exports.deleteProduct = (req, res) => {
  let product = req.product;
  product.remove((err, deletedProduct) => {
    if (err) {
      return res
        .status(400)
        .json({ error: "Failed to delete the product or tshirt" });
    }
    res.json({ message: "Product deleted successfully", deletedProduct });
  });
};

// update the product
exports.updateProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return rs.status(400).json({
        error: "problem with image",
      });
    }

    // updating the product using the lodash
    let product = req.product;
    product = _.extend(product, fields); // taking advantage of loadash here

    // handle the file here
    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          error: "File size too big!",
        });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }

    //? save the updated product to the DB
    product.save((err, updatedProduct) => {
      if (err) {
        res.status(400).json({
          error: "Updation failed",
        });
      }
      res.json(updatedProduct);
    });
  });
};

// products listing route -> get all products
exports.getAllProducts = (req, res) => {
  let userLimit = req.query.limit ? parseInt(req.query.limit) : 8;
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";

  Product.find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy, "asc"]])
    .limit(userLimit)
    .exec((err, products) => {
      if (err) {
        return res.status(400).json({ error: "No Products found in the db" });
      }
      res.json(products);
    });
};

exports.getAllUniqueCategories = (req, res) => {
  Product.distinct("category", {}, (err, categories) => {
    if (err) {
      return res.status(400).json({
        error: "No category found ",
      });
    }
    res.json(categories);
  });
};

exports.updateStock = (req, res, next) => {
  // loop through all the products in the cart and update them accordingly
  let myOperations = req.body.order.products.map((eachProduct) => {
    return {
      updateOne: {
        filter: { _id: eachProduct._id },
        update: {
          $inc: { stock: -eachProduct.count, sold: +eachProduct.count },
        },
      },
    };
  });
  Product.bulkWrite(myOperations, {}, (err, resultProducts) => {
    if (err) {
      return res.status(400).json({
        error: "Bulk operation failed ",
      });
    }
    next();
  });
};

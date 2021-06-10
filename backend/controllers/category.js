const Category = require("../models/category");

// param extractor or middleware
exports.getCategoryById = (req, res, next, id) => {
  Category.findById(id).exec((err, foundCategory) => {
    if (err) {
      return res.status(400).json({
        error: "Category not found in the DB",
      });
    }
    // if the category found with the param category id then store it in 'category'
    req.category = foundCategory;
    next();
  });
};

// to create the new category
exports.createCategory = (req, res) => {
  const newcategory = new Category(req.body);
  // below line of code is added by me and it is not part of the course.. just to store which admincreated teh collection/category
  newcategory.addedby = req.profile.name;

  newcategory.save((err, newcategory) => {
    if (err) {
      return res.status(400).json({
        error: "NOT able to create the category in db",
      });
    }
    res.json({ newcategory });
  });
};

// to get the single category
exports.getCategory = (req, res) => {
  // we have already extracted the category using the param getCategoryById and we have stored the category
  // so we can simply send the stored category
  return res.json(req.category); // here the category is being populated by the param middleware
};

// to get all the available categories
exports.getAllCategory = (req, res) => {
  Category.find().exec((err, categories) => {
    if (err) {
      return res.status(400).json({
        error: "NO Categories found in the DB",
      });
    }
    return res.json(categories);
  });
};

// to update the already existing category
exports.updateCategory = (req, res) => {
  const categoryTobeUpdated = req.category; // we have populated the category obj in middleware -> getCategoryById
  categoryTobeUpdated.name = req.body.name;

  categoryTobeUpdated.save((err, updatedCategory) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to update the category",
      });
    }
    return res.json(updatedCategory);
  });
};

// to delete the category
exports.removeCategory = (req, res) => {
  const categoryTobeRemoved = req.category;
  categoryTobeRemoved.remove((err, deletedCategory) => {
    if (err) {
      return res.status(400).json({
        error: "Unable to delete the category",
      });
    }
    return res.json({
      message: `successfully deleted the ${deletedCategory.name} category`,
    });
  });
};

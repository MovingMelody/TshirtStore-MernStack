const Order = require("../models/order");
const User = require("../models/user");

// to get the user by ID -> middleware
exports.getUserById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    // if there is any error i.e if there is no user with the requested id
    if (err || !user) {
      return res.status(400).json({
        error: "No user was found in DB",
      });
    }

    // if the control gets here it means user has found with the given id
    req.profile = user; // storing the user in request object
    next();
  });
};

exports.getUser = (req, res) => {
  // when user hits this /user/:id this controller will be called if the id is correct then we can send some response
  // req.profile object is populated in getUserById controller see above
  // here we are sending the store req.profile as response to user so we have to hide some info like salt, encrypswd, createdat etc
  // we not making these undefined int req.profile object only not in the database remember
  req.profile.salt = undefined;
  req.profile.encrypted_password = undefined;
  req.profile.updatedAt = undefined;
  req.profile.createdAt = undefined;
  return res.json(req.profile);
};

// update the user controller
exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(
    { _id: req.profile._id },
    { $set: req.body },
    { new: true, useFindAndModify: false },
    (err, user) => {
      if (err || !user) {
        return res.status(400).json({
          error: "you are not authorized to update this user informatio",
        });
      }
      user.salt = undefined;
      user.encrypted_password = undefined;
      user.updatedAt = undefined;
      user.createdAt = undefined;
      // before sending some res lets hide some fields
      return res.json(user);
    }
  );
};

// to return all the purchases by user ->  observe we are pulling the user orders using the Order schema not directly from the user model purchases array
exports.userPurchaseList = (req, res) => {
  Order.find({ user: req.profile._id })
    .populate("user", "_id name ")
    .exec((err, orders) => {
      if (err) {
        return res.status(400).json({
          error: "No orders found in this account",
        });
      }
      return res.json(orders);
    });
};

// to push the order in purchase list (middleware)
exports.pushOrderInPurchaseList = (req, res, next) => {
  let currentPurchases = [];

  req.body.order.products.forEach((product) => {
    currentPurchases.push({
      _id: product._id,
      name: product.name,
      description: product.description,
      category: product.category,
      quantity: product.quantity,
      amount: req.body.order.amount,
      transaction_id: req.body.order.transaction_id,
    });
  });

  // now store or add the currentPurchaes in DB to the previous purchases
  User.findByIdAndUpdate(
    { _id: req.profile._id },
    { $push: { purchases: currentPurchases } },
    { new: true },
    (err, purchases) => {
      if (err) {
        return res
          .status(400)
          .json({ error: "Unable to save the currentPurchases to purchases" });
      }
      next();
    }
  );
};

// assignment done successfully
// exports.getAllUsers = (req, res) => {
//   User.find().exec((err, users) => {
//     if (err || !users) {
//       return res.status(400).json({ error: "No users found" });
//     }

//     res.json(users);
//   });
// };

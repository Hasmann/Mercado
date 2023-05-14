const { validationResult } = require("express-validator");
const fileDelFunc = require("../deleteFiles.js");
const Product = require("./../model/Products");
const Orders = require("./../model/orders");
const catchAsync = require("./../catchAsync");
const errorClass = require("./../errorClass");
const { ObjectID, ObjectId } = require("bson");

exports.getMerchantlogin = (req, res, next) => {
  try {
    res.render("auth/merchantLogin", {
      pageTitle: "MerchantLogin",
      path: "/login",
      errorMessage: false,
    });
  } catch (err) {
    res.status(400).json({
      status: "Failed",
      error: err,
    });
  }
};
exports.getSignUp = (req, res, next) => {
  try {
    res.render("auth/signup", {
      pageTitle: "MerchantSignUp",
      path: "/signup",

      errorMessage: false,
      // csrfToken: req.csrfToken(),
    });
  } catch (err) {
    res.status(400).json({
      status: "Failed",
      error: err,
    });
  }
};

exports.postProducts = async (req, res, next) => {
  try {
    res.render("admin/add-product", {
      pageTitle: "Add-Product",
      path: "/signup",
      wrongInput: [],
      errorMessage: false,
      // csrfToken: req.csrfToken(),
    });
  } catch (err) {
    res.status(400).json({
      status: "Failed",
      error: err,
    });
  }
};

////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
///////////////////////////////////////////////////////
//////////////////////////////////////////////////////
/////////////////////////////////////////////////////
////////////////////////////////////////////////////
///////////////////////////////////////////////////
exports.getAddProduct = (req, res, next) => {
  res.status(200).render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    errorMessage: "",
    userValues: {},
    wrongInput: [],
  });
};

exports.postProductss = async (req, res, next) => {
  try {
    const { name, category, price, summary, description, stockQuantity } =
      req.body;
    const image = req.file;
    if (!image) {
      return console.log("THERE IS NO FILE");
      // return res.render("admin/edit-product", {
      //   pageTitle: "Add Product",
      //   path: "/admin/add-product",
      //   editing: false,
      //   errorMessage: "Enter A valid File",
      //   userValues: {},
      //   wrongInput: [],
      // });
    }
    // if (!errors.isEmpty()) {
    //   console.log(errors.array());
    //   return res.render("admin/edit-product", {
    //     pageTitle: "Add Product",
    //     path: "/admin/add-product",
    //     editing: false,
    //     errorMessage: errors.array()[0].msg,
    //     userValues: {
    //       title: req.body.title,
    //       image: req.file,
    //       price: req.body.price,
    //       description: req.body.description,
    //     },
    //     wrongInput: errors.array(),
    //   });
    // }

    const imagePath = image.path;
    const product = await Product.create({
      name: name,
      category: category,
      price: price,
      summary: summary,
      description: description,
      stockQuantity: stockQuantity,
      merchant: req.user._id,
      productImage: imagePath,
    });
    console.log("my fileeeeeeee", req.file);
    if (product) {
      res.redirect("/Mercado/Merchant/allProducts");
    }
    // console.log(result);
  } catch (err) {
    console.log(err);
  }
};

exports.getEditProduct = async (req, res, next) => {
  try {
    const editMode = req.query.edit;
    if (!editMode) {
      return res.redirect("/");
    }
    const prodId = req.params.prodId;
    const product = await Product.findById(prodId);

    if (!product) {
      return res.redirect("/");
    }
    res.render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: editMode,
      product: product,
      errorMessage: "",
      userValues: {},
      wrongInput: [],
    });
  } catch (err) {
    console.log(err);
  }
};

exports.postEditProduct = catchAsync(async (req, res, next) => {
  const prodId = req.body.productId;
  const errors = validationResult(req);
  const image = req.file;

  if (image) {
    req.body.productImage = image.path;
    const prod = await Product.findOne({ _id: prodId });

    fileDelFunc(prod.productImage);
  }

  const prodUpdate = await Product.findByIdAndUpdate(prodId, req.body, {
    useFindAndModify: false,
  });

  if (prodUpdate) {
    res.redirect("/Mercado/Merchant/allProducts");
    res.status(200).json({
      status: "successful",
      message: "UPDATED SUCCESSFULLY",
    });
    console.log("UPDATED SUCCESSFULLY");
    return;
  }

  if (!prodUpdate) {
    next(errorClass("FailedToUpdateProduct", 400));
  }
});

exports.getMerchantProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ merchant: req.user._id });

    res.render("admin/merchantProducts", {
      prods: products,
      pageTitle: "Admin Products",
      path: "/admin/products",
      errorMessage: " ",
    });
  } catch (err) {
    console.log(err);
  }
};

exports.postDeleteProduct = catchAsync(async (req, res, next) => {
  const prodId = req.body.productId;
  const delProd = await Product.findOne({ _id: prodId });

  const deletingProduct = await delProd.deleteOne({ _id: prodId });
  fileDelFunc(delProd.productImage);
  if (deletingProduct) {
    res.status(200).json({
      status: "Successful",
      message: "product Deleted Successfully",
    });
    console.log("Product Deleted Succesfully :)");
  }

  if (!deletingProduct) {
    next(errorClass("Failed To delete This product!!", 400));
  }
});

exports.productMonthlyStats = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const OrderStats = await Orders.find({
    "product.items.productId": req.params.productId,
  });
  console.log(OrderStats.length);
  const bM = await Orders.aggregate([
    {
      $match: {
        "product.items.productId": ObjectId(req.params.productId),
      },
    },
    {
      $unwind: "$orderedAt",
    },
    {
      $match: {
        orderedAt: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: "$orderedAt" },
        value: { $sum: 1 },
        sales: { $push: "$name" },
      },
    },
    {
      $sort: {
        _id: 1,
      },
    },
    { $addFields: { month: "$_id" } },
    // { $limit: 2 },
  ]);

  if (!bM) {
    return next(new errorClass(`CANNOT DELIVER THIS AGGREGATE `, 404));
  }
  res.status(200).json({
    results: bM.length,
    status: "success",
    data: {
      bM,
    },
  });
});

exports.getStatsChart = async (req, res, next) => {
  try {
    const productId = req.params.productId;
    res.render("admin/productStats", {
      pageTitle: "Product Stats",
      path: "/admin/products",
      errorMessage: " ",
      productId: productId,
    });
  } catch (err) {
    console.log(err);
  }
};

//
//
//
//
//

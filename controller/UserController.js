const fs = require("fs");
const path = require("path");
const Product = require("./../model/Products.js");
const pdfDoc = require("pdfkit");
const { request } = require("http");
const { countDocuments } = require("./../model/userModel");
const User = require("./../model/userModel");
const WishList = require("./../model/wishlist.js");
const errorClass = require("./../errorClass");
const catchAsync = require("./../catchAsync");
const orders = require("./../model/orders");
const stripe = require("stripe")(
  "sk_test_51LlGbIGhTAOgsQWyFfpEvm7z3GlrtMPDR8N95WaLDCpw9zxmeW7IdZp9omjGLOijIohRZ9OR3XRfzM0SCeY096rI00tnQ8s5fW"
);
const pageLimit = 2;

exports.addToWishlist = catchAsync(async (req, res, next) => {
  const productId = req.body.productId;
  const addwishlist = await WishList.find({ user: req.user._id }).populate(
    "wishlistProduct"
  );
  console.log(addwishlist);
  let idAlone = [];
  if (addwishlist.length > 0) {
    idAlone = addwishlist.map((el) => {
      return el.wishlistProduct.id;
    });
    console.log(idAlone);
  }

  if (idAlone.includes(productId)) {
    return res.status(400).json({
      status: "FAILED",
      message: "THIS IS ALREADY A PART OF YOUR WISHLIST",
    });
  } else {
    const wishl = await WishList.create({
      wishlistProduct: productId,
      user: req.user._id,
    });
    res.status(201).json({
      status: "Successful",
      message: "wishlist added successfully",
      wishlistProduct: {
        wishl,
      },
    });
  }

  if (!wishl) {
    next(errorClass("Wishlist Error", 400));
  }
});
exports.getlogin = (req, res, next) => {
  try {
    res.render("auth/Login", {
      pageTitle: "UserLogin",
      path: "/login",
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

exports.getSignUp = (req, res, next) => {
  try {
    console.log("isLogged:::::", req.user);
    res.render("auth/userSignUp", {
      pageTitle: "UserSignUp",
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

exports.forgotPassword = (req, res, next) => {
  try {
    res.render("auth/sendResetToken", {
      pageTitle: "ResetPassword",
      path: "",

      errorMessage: false,
      // csrfToken: req.csrfToken(),
    });
  } catch (err) {
    res.status(400).json({
      status: "FAILED",
      error: err,
    });
  }
};

exports.resetPassword = (req, res, next) => {
  try {
    res.render("auth/resetPassword", {
      pageTitle: "ResetPassword",
      path: "",
      errorMessage: false,
      // csrfToken: req.csrfToken(),
    });
  } catch (err) {
    res.status(400).json({
      status: "FAILED",
      error: err,
    });
  }
};

//TODO ADD THE CODE ABOVE
/////////////////////////////////////////////////
/////////////////////////////////////////////////
/////////////////////////////////////////////////
/////////////////////////////////////////////////
/////////////////////////////////////////////////
/////////////////////////////////////////////////
/////////////////////////////////////////////////
/////////////////////////////////////////////////
/////////////////////////////////////////////////
/////////////////////////////////////////////////
exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.find();

    res.render("shop/product-list", {
      prods: products,
      pageTitle: "All Products",
      path: "/products",
      isAuthenticated: req.session.isLoggedIn,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    const prodId = req.params.productId;

    const product = await Product.findById({ _id: prodId });
    const findsimilarProduct = await Product.find({
      category: product.category,
    });
    const length = findsimilarProduct.length;
    const similarProduct = [];
    for (let i = 0; i < 10; i++) {
      similarProduct.push(
        findsimilarProduct[Math.floor(Math.random() * length + 1)]
      );
    }
    const description = product.description.split(",");
    console.log("SIMILAR PRODUCTT", similarProduct);
    res.render("shop/product-detail", {
      product: product,
      pageTitle: product.name,
      path: "/products",
      description: description,
      similarProduct: similarProduct,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getIndex = async (req, res, next) => {
  try {
    const textSearch = req.params.textSearch;
    Product.createIndexes({
      name: "text",
      description: "text",
      summart: "text",
    });

    const totalProducts = await Product.find({
      $or: [
        { name: { $regex: textSearch, $options: "i" } },
        { summary: { $regex: textSearch, $options: "i" } },
        { description: { $regex: textSearch, $options: "i" } },
      ],
    }).countDocuments();
    const page = +req.query.page;
    const products = await Product.find({
      $or: [
        { name: { $regex: textSearch, $options: "i" } },
        { summary: { $regex: textSearch, $options: "i" } },
        { description: { $regex: textSearch, $options: "i" } },
      ],
    })
      .skip((page - 1) * pageLimit)
      .limit(pageLimit);
    console.log(totalProducts);
    res.render("shop/index", {
      prods: products,
      pageTitle: "Shop",
      path: "/",
      currentPage: +page,
      hasNextPage: pageLimit * page < totalProducts,
      hasPreviousPage: page > 1,
      nextPage: page + 1,
      previousPage: page - 1,
      lastPage: Math.ceil(totalProducts / pageLimit),
    });
  } catch (err) {
    console.log(err);
  }
};
exports.getCart = async (req, res, next) => {
  try {
    const product = await req.user.populate("cart.items.productId");

    const products = product.cart.items;
    console.log(products);
    res.render("shop/cart", {
      path: "/cart",
      pageTitle: "Your Cart",
      products: products,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.postCart = catchAsync(async (req, res, next) => {
  const prodId = req.body.productId;

  const addToCart = await req.user.addToCart(prodId);
  res.status(201).json({
    status: "Success",
    message: "Added To Cart Successfully",
    Item: { addToCart },
  });

  if (!addToCart) {
    next(errorClass("Failed To Add To cart!!"), 401);
  }
});

exports.postCartDeleteProduct = async (req, res, next) => {
  try {
    const prodId = req.body.productId;
    const deleteFromCart = await req.user.deleteItemFromCart(prodId);
    res.status(200).json({
      status: "Success",
      message: "Item Successfully Removed from Cart",
      Item: { deleteFromCart },
    });
  } catch (err) {
    res.status(400).json({
      status: "Failed",
      message: "Item not Deleted From Cart",
    });
  }
};

exports.postOrder = async (req, res, next) => {
  const token = req.body.stripeToken; // Using Express
  let total = 0;
  let order = "";
  try {
    const getproductUser = await req.user.populate("cart.items.productId");

    const productArray = getproductUser.cart.items;
    req.user.cart.items;
    for (const prood of productArray) {
      const proddd = await Product.findOne({ _id: prood.productId._id });
      proddd.stockQuantity = proddd.stockQuantity - prood.quantity;
      await proddd.save({ validateBeforeSave: false });
      console.log(proddd);
    }
    ////////////
    for (const userCart of req.user.cart.items) {
      total += userCart.productId.price * userCart.quantitiy;
      order = await orders.create({
        name: { fullName: req.user.fullName, userId: req.user._id },
        product: {
          items: { productId: userCart.productId, quantity: userCart.quantity },
        },
      });
    }
    const charge = stripe.charges.create({
      amount: total * 100,
      currency: "usd",
      description: "Demo Order",
      source: token,
      // metadata: { order_id: order._id.toString() },
    });

    await req.user.clearCart();
    // await orders.create({
    //   name: { fullName: req.user.name, userId: req.user._id },
    //   products: {
    //     items: req.user.cart.items,
    //   },
    // });
    res.redirect("/cart");
  } catch (err) {
    res.status(400).json({
      status: "Faileedd",
      Error: err,
    });
  }
};

exports.getHomePage = async (req, res, next) => {
  try {
    let viewed;
    let recentlyViewed;
    if (req.user) {
      viewed = await req.user.populate("recentlyViewed.pages.product");
      recentlyViewed = viewed.recentlyViewed.pages;
    } else {
      recentlyViewed = req.cookies.recentlyViewed;
    }
    res.render("shop/homePage", {
      path: "/home",
      pageTitle: "Mercado",
      recentlyViewed: recentlyViewed,
    });
  } catch (err) {
    res.status(400).json({
      status: "Failed",
      Error: err,
    });
    // }
    // req.user
    //   .getOrders()
    //   .then((orders) => {
    //     res.render("shop/orders", {
    //       path: "/orders",
    //       pageTitle: "Your Orders",
    //       orders: orders,
    //     });
    //   })
    //   .catch((err) => console.log(err));
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const order = await orders
      .find({ "name.userId": req.user._id })
      .populate("product.items.productId");

    console.log(order);
    res.render("shop/orders", {
      path: "/orders",
      pageTitle: "Your Orders",
      orders: order,
    });
  } catch (err) {
    res.status(400).json({
      status: "Failed",
      Error: err,
    });
    // }
    // req.user
    //   .getOrders()
    //   .then((orders) => {
    //     res.render("shop/orders", {
    //       path: "/orders",
    //       pageTitle: "Your Orders",
    //       orders: orders,
    //     });
    //   })
    //   .catch((err) => console.log(err));
  }
};
exports.checkOut = async (req, res, next) => {
  try {
    const product = await req.user.populate("cart.items.productId");

    const products = product.cart.items;
    console.log(products);
    let totals = 0;
    for (const checkOut of products) {
      totals += checkOut.productId.price * checkOut.quantity;
    }
    res.render("shop/checkout", {
      path: "/check-out",
      pageTitle: "Check-Out",
      products: products,
      total: totals,
    });
  } catch (err) {
    res.status(400).json({
      status: "Faileed",
      Error: err,
    });
  }
};

exports.downloadInvoice = async (req, res, next) => {
  try {
    const orderId = req.params.orderId;
    const pdfFile = "order" + orderId + ".pdf";
    const myPath = path.join("pdf", pdfFile);
    fs.writeFile(myPath, "GOOD EVENING I HOPE YOU ARE DOING WELL", (err) => {
      if (err) {
        console.log(err);
      }
    });
    // const data = fs.readFile(myPath, (err, data) => {
    //   if (err) {
    //     return console.log(err);
    //   }
    //   res.setHeader("Content-Type", "application/pdf");
    //   res.setHeader("Content-Disposition", 'inline;filename="' + pdfFile + '"');
    //   return res.send(data);
    // });
    //it will be more effective to stream this file if the file is bigger so lets gooo

    // const stream = fs.createReadStream(myPath);

    // res.setHeader("Content-Type", "application/pdf");
    // res.setHeader("Content-Disposition", 'inline;filename="' + pdfFile + '"');
    // stream.pipe(res);

    //or we can both automatically create a new pdf file and also add things to it by using a third party npm valled pdfkit

    const pdfDocument = new pdfDoc();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'inline;filename="' + pdfFile + '"');
    pdfDocument.pipe(fs.createWriteStream(myPath));
    pdfDocument.pipe(res);

    pdfDocument.text("Hello world", { underline: true });

    const orderInvoice = await orders
      .findOne({ _id: orderId })
      .populate("product.items.productId");

    pdfDocument.text(`Name: ${orderInvoice.name.fullName}`, {
      underline: true,
    });

    pdfDocument.text(`OrderId: ${orderInvoice._id}`, {
      underline: true,
    });
    pdfDocument.text(`Product: ${orderInvoice.product.items.productId.name}`, {
      underline: true,
    });
    pdfDocument.text(`Quantity: ${orderInvoice.product.items.quantity}`, {
      underline: true,
    });
    pdfDocument.text(
      `TOTAL: $${
        orderInvoice.product.items.productId.price *
        orderInvoice.product.items.quantity
      }`,
      {
        underline: true,
      }
    );

    pdfDocument.end();
  } catch (err) {
    console.log(err);
  }
};

exports.createOrders = async (req, res, next) => {
  try {
    const product = await Product.find({});
    // Generate 100 documents
    for (let m = 0; m < product.length; m++) {
      for (let i = 0; i < 100; i++) {
        const order = orders.create({
          name: {
            fullName: req.user.fullName,
            userId: req.user._id,
          },
          product: {
            items: {
              productId: product[m]._id,
              quantity: Math.floor(Math.random() * 10) + 1, // Random number from 1 to 10
            },
          },
          orderedAt:
            new Date("2018-01-01T00:00:00.000Z").getTime() +
            Math.random() *
              (new Date().getTime() -
                new Date("2018-01-01T00:00:00.000Z").getTime()), // Random date from 2018 to now
        });
      }
    }
  } catch (err) {
    console.log(err);
  }
};

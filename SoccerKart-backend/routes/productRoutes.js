const express = require('express');
const { isAdmin, requireSignIn } = require('../middleware/authMiddleware');
const { productCountController, createProductController, getProductController, updateProductController, productPhotoController, getSingleProductController, deleteProductController, productFiltersController, productListController, searchProductController } = require('../controllers/productController.js')
const formidable = require("express-formidable")

const router = express.Router();

router.post("/create-product", requireSignIn, isAdmin, formidable(), createProductController);

//routes
router.put(
  "/update-product/:pid",
  requireSignIn,
  isAdmin,
  formidable(),
  updateProductController
);


//get products
router.get("/get-product", getProductController);


router.get("/get-product/:slug", getSingleProductController);

//get photo
router.get("/product-photo/:pid", productPhotoController);

//delete rproduct
router.delete("/delete-product/:pid", deleteProductController);

//filter product
router.post('/product-filters', productFiltersController);

//count  product
router.get('/product-count', productCountController)

//product per page
router.get('/product-list/:page', productListController)

//search filter
router.get('/search/:keyword', searchProductController)

module.exports = router;
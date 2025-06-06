const ExpressFormidable = require('express-formidable')
const Product = require('../models/productModel.js');
const Category = require("../models/category.js");
const  fs = require('fs');
const slugify = require('slugify');
const { parseArgs } = require('util');



const createProductController = async (req, res) => {  
    try {
        const { name, slug, description, price, category, quantity, shipping } =
          req.fields;
        const { photo } = req.files;
        //validation
        switch (true) {
          case !name:
            return res.status(500).send({ error: "Name is Required" });
          case !description:
            return res.status(500).send({ error: "Description is Required" });
          case !price:
            return res.status(500).send({ error: "Price is Required" });
          case !category:
            return res.status(500).send({ error: "Category is Required" });
          case !quantity:
            return res.status(500).send({ error: "Quantity is Required" });
          case photo && photo.size > 1000000:
            return res
              .status(500)
              .send({ error: "photo is Required and should be less then 1mb" });
        }
    
        const products = new Product({ ...req.fields, slug: slugify(name) });
        if (photo) {
          products.photo.data = fs.readFileSync(photo.path);
          products.photo.contentType = photo.type;
        }
        await products.save();
        res.status(201).send({
          success: true,
          message: "Product Created Successfully",
          products,
        });
      } catch (error) {
        console.log(error);
        res.status(500).send({
          success: false,
          error,
          message: "Error in creating product",
        });
      }
    };
//get all products
const getProductController = async (req, res) => {
    try {
      const products = await Product
        .find({})
        .populate({ path: "category", model: "categories" })
        .select("-photo")
        .limit(12)
        .sort({ createdAt: -1 });
      res.status(200).send({
        success: true,
        countTotal: products.length,
        message: "AllProducts",
        products,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error in getting products",
        error: error.message,
      });
    }
  };

  //upate products
const updateProductController = async (req, res) => {
    try {
      const { name, description, price, category, quantity, shipping } =
        req.fields;
      const { photo } = req.files;
      //validation
      switch (true) {
        case !name:
          return res.status(500).send({ error: "Name is Required" });
        case !description:
          return res.status(500).send({ error: "Description is Required" });
        case !price:
          return res.status(500).send({ error: "Price is Required" });
        case !category:
          return res.status(500).send({ error: "Category is Required" });
        case !quantity:
          return res.status(500).send({ error: "Quantity is Required" });
        case photo && photo.size > 1000000:
          return res
            .status(500)
            .send({ error: "photo is Required and should be less then 1mb" });
      }
  
      const products = await Product.findByIdAndUpdate(
        req.params.pid,
        { ...req.fields, slug: slugify(name) },
        { new: true }
      );
      if (photo) {
        products.photo.data = fs.readFileSync(photo.path);
        products.photo.contentType = photo.type;
      }
      await products.save();
      res.status(201).send({
        success: true,
        message: "Product Updated Successfully",
        products,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        error,
        message: "Error in Update product",
      });
    }
  };

  // get single product
  const getSingleProductController = async (req, res) => {
    try {
      const product = await Product
        .findOne({ slug: req.params.slug })
        .select("-photo")
        .populate({ path: "category", model: "categories" })       
      res.status(200).send({
        success: true,
        message: "Single Product Fetched",
        product,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Eror while getitng single product",
        error,
      });
    }
  };
 const productPhotoController = async (req, res) => {
    try {
      const product = await Product.findById(req.params.pid).select("photo");
      if (product.photo.data) {
        res.set("Content-type", product.photo.contentType);
        return res.status(200).send(product.photo.data);
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Erorr while getting photo",
        error,
      });
    }
  };
//delete controller
const deleteProductController = async (req, res) => {
    try {
      await Product.findByIdAndDelete(req.params.pid).select("-photo");
      res.status(200).send({
        success: true,
        message: "Product Deleted successfully",
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error while deleting product",
        error,
      });
    }
  };

  const productFiltersController = async (req, res) => {
    try {
      const {checked, radio} = req.body;
      let args = {}
      if (checked.length > 0) args.category = checked
      if (radio.length) args.price = {$gte: radio[0], $lte: radio[1]};
      const products = await Product.find(args)
      res.status(200).send({
        success: true,
        products,
      })
    } catch (error) {
      console.log(error);
      res.status(400).send({
        success: false,
        message: "Error while filtering product",
        error,
      });
    }
  }
// product count
const productCountController = async (req, res) => {
  try {
    const total = await Product.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: "Error in product count",
      error,
      success: false,
    });
  }
};

// product list base on page
const productListController = async (req, res) => {
  try {
    const perPage = 2;
    const page = req.params.page ? req.params.page : 1;
    const products = await Product
      .find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error in per page ctrl",
      error,
    });
  }
};

const searchProductController = async (req, res) =>  {
    try {
      const {keyword} = req.params
      const result = await Product.find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-photo");
      res.json(result);
    } catch (error) {
      console.log(error)
      res.status(400).send({
        success: false,
        message: "error in searching product",
        error,
      });
    }
}

module.exports = {searchProductController,productListController,createProductController,deleteProductController, getSingleProductController, getProductController,productCountController, productPhotoController, updateProductController, productFiltersController}
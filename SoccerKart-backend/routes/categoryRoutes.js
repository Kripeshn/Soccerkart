const express = require("express");
const {isAdmin, requireSignIn}= require('../middleware/authMiddleware.js');
const {createCategoryController, updateCategoryController, categoryController, singleCategoryController,deleteCategoryController} =  require('../controllers/categoryController.js')

const router = express.Router();

//Create category
router.post(
    '/create-category', 
    requireSignIn,
    isAdmin,
    createCategoryController
);

//update category
router.put(
    '/update-category/:id', 
    requireSignIn, 
    isAdmin, 
    updateCategoryController
)


//get all category
router.get(
    '/get-category', categoryController
)

//aingle category
router.get(
    '/single-category/:slug',
    singleCategoryController
)

router.delete(
    '/delete-category/:id',
    requireSignIn, isAdmin, deleteCategoryController)




module.exports = router;

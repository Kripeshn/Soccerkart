const  Category =  require('../models/category.js');
const slugify = require('slugify');

const createCategoryController = async (req, res) => {
    try {
        const {name} = req.body;
        if(!name) {
            return res.status(401).send({message: 'Name is required'})
        }
        const exisitingCategory = await Category.findOne({name})
        if(exisitingCategory){
            return res.status(200).send({
                success: true, 
                message: 'Category already exists',
            })
        }
        const category = await new Category({name, slug:slugify(name)}).save();
        res.status(201).send({
            success: true,
            message: 'new category created',
            category,

        })
        
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: 'Error in category'
        })
    }
}; 

//update category 
const updateCategoryController = async  (req, res) => {
    try {
        const {name} = req.body
        const {id} = req.params
        const category =  await Category.findByIdAndUpdate(id, {name, slug: slugify(name)},{new: true});
        res.status(200).send({
            success: true,
            message: "Category updated successfully",
            category
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success : false,
            message: "Error while updating category",
            error
        })
    }
}

//get all category
const categoryController = async (req, res) => {
    try {
        const category = await Category.find({});
        res.status(200).send({
            success: true,
            messaege: "All Categories list",
            category,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success : false,
            message: "Error while getting all category",
            error
        })
    }
}

//get single category
const singleCategoryController = async (req, res ) => {
    try {
     
        const category = await Category.findOne({slug: req.params.slug})
        res.status(200).send({
            success: true,
            messaege: "Get single Category list successfully",
            category,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success : false,
            message: "Error while getting single category",
            error
        })
    }
}
//delete category
const deleteCategoryController = async (req, res ) => {
    try {    
        const {id} = req.params;
        await Category.findByIdAndDelete(id);
        res.status(200).send({
            success: true,
            messaege: "Deleted Successfully",
           
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success : false,
            message: "Error while deleting category",
            error
        })
    }
}


module.exports = {createCategoryController,  updateCategoryController, categoryController, singleCategoryController, deleteCategoryController};
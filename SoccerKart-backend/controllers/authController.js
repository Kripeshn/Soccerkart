const User1 = require("../models/users.js")




const registerController = async(req, res) => {
    try {
        // const {}
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error',
            error
        })
    }
}

module.exports = registerController;

const mongoose = require("mongoose")

const SoccerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    } ,
    email: {
        type: String,
        required: true,
        unique: true
    } ,
    password: {
        type: String,
        required: true,    
    },
    answer: {
            type: String,
            required: true,
    },
    role: {
        type: Number,
        default: 0
    },
    phone: {
        type: String,
        trim: true,
        default: ""
    },
    address: {
        type: String,
        trim: true,
        default: ""
    }
}, {timestamps: true});

const User1 = mongoose.model("users", SoccerSchema);
module.exports = User1;
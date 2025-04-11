const bcrypt = require('bcryptjs');


const hashPassword = async(password) => {
    try {
        const saltRounds = 10;
        const hashedPW = await bcrypt.hash(password, saltRounds);
        return hashedPW;
    } catch (error) {
        console.log(error);
    }
}

const comparePassword = async (password, hashedPW) =>{
    return bcrypt.compare(password, hashedPW);
}

module.exports = { hashPassword, comparePassword };


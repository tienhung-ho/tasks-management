const mongoose = require('mongoose')

module.exports.conect = async (req, res) => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log('Connect to database!');
    }
    catch (err) {
        console.log('Connect failure!')
    }
}

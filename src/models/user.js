const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        trim: true,
        min: 3,
        max: 20
    },
    lastname: {
        type: String,
        trim: true,
        min: 3,
        max: 20
    },
    email: {
        type: String,
        require: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    hash_password: {
        type: String,
        require: true
    },
    gender:{
        type: String,
        enum: ['male', 'female','notSpecified'],
        default: 'notSpecified'
    }
    ,
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    contactNumber: {
        type: Number
    },
    profilePicture: [{
        img: { type: String }
    }],
    activeStatus: {
        type: Boolean,
        default: true
    },
    address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserAddress'
    },
}, { timestamps: true })

// userSchema.virtual('password')
// .set(function(password){
//     this.hash_password=bcrypt.hashSync(password,10);
// })

userSchema.virtual('fullname')
    .set(function (firstname, lastname) {
        return `${firstname} ${lastname}`
    })

userSchema.methods = {
    authenticate: async function (password) {
        return await bcrypt.compare(password, this.hash_password);
    }
}



const userModel = mongoose.model('user', userSchema)

module.exports = userModel;


// username: {
//     type: String,
//     trim: true,
//     lowercase: true,
//     unique: true,
//     index: true
// },
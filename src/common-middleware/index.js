const User = require('../models/user');
const jwt = require('jsonwebtoken')
const multer = require('multer')
const path = require('path')
const shortid = require('shortid')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(path.dirname(__dirname), 'uploads'))
    },
    filename: function (req, file, cb) {
        cb(null, shortid.generate() + '-' + file.originalname)
    }
})

exports.upload = multer({ storage })


exports.requireSignIn = (req, res, next) => {
    const token = req.headers.token;
    if (token) {
        const user = jwt.verify(token, process.env.SECRET_KEY)
        User.findById(user._id)
            .exec((error, user) => {
                if (error) return res.status(404).send(error)
                if (user) {
                    req.user = user
                    next()
                }
            })
    }
    if (!token) return res.status(401).send({ message: 'you have to be login first' })

}

exports.adminMiddleware = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(400).send("admin access denied")
    }
    next();
}

exports.userMiddleware = (req, res, next) => {

    if (req.user.role !== "user") {
        return res.status(400).json({ message: "user access denied" })
    }
    next();
}

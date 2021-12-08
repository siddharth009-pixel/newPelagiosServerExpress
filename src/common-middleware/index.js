const User = require('../models/user');
const jwt = require('jsonwebtoken')
const multer = require('multer')
const path = require('path')
const shortid = require('shortid')
const multerS3 = require('multer-s3')
const aws = require('aws-sdk')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(path.dirname(__dirname), 'uploads'))
    },
    filename: function (req, file, cb) {
        cb(null, shortid.generate() + '-' + file.originalname)
    }
})

exports.upload = multer({ storage })


const s3=new aws.S3({
    accessKeyId:process.env.S3_ACCESSKEYID,
    secretAccessKey:process.env.S3_SECRETACCESSKEY
})


exports.uploadS3 = multer({
    storage: multerS3({
      s3: s3,
      acl:'public-read',
      contentType: multerS3.AUTO_CONTENT_TYPE,
      contentDisposition:'inline',
      bucket: 'utopianbuys',
      metadata: function (req, file, cb) {
        cb(null, {fieldName: file.fieldname});
      },
      key: function (req, file, cb) {
        cb(null,  shortid.generate() + '-' + file.originalname)
      }
    })
})



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

const User = require('../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

exports.signUp = async (req, res) => {

    console.log('come in')
    User.findOne({ email: req.body.email })
        .exec(async (err, isUser) => {
            if (isUser) return res.status(400).send("email already exists")
            if (err) {
                return res.status(400).send(error)
            }
            const { name, email, password, contactNumber } = req.body;

            const hash_password = await bcrypt.hash(password, 10)

            let user = new User({
                firstname: name,
                contactNumber,
                email,
                hash_password
            })

            //const newuser=await user.save();

            console.log('hello');
            user.save((err, data) => {
                if (err) {
                    return res.status(500).send({ err: err })
                }
                if (data) {
                    console.log(data)
                    return res.status(201).send(data)
                }
            })

        })

}


exports.signIn = async (req, res) => {
    User.findOne({ email: req.body.email })
        .exec(async (err, user) => {
            if (err) {
                return res.status(404).send('internal server error')
            }
            if (!user) {
                return res.status(404).send('email is not registered')
            }
            if (user) {
                const passCheck = await user.authenticate(req.body.password)

                if (passCheck && user.role === 'user') {
                    const token = jwt.sign({ _id: user._id, role: user.role }, process.env.SECRET_KEY, { expiresIn: '365d' })
                    const {
                        firstname,
                        lastname,
                        email,
                        role,
                        contactNumber,
                        gender
                    } = user;
                    res.status(200).json({
                        token, user: {
                            firstname,
                            lastname,
                            email,
                            role,
                            contactNumber,
                            gender
                        }

                    })
                } else {
                    return res.status(400).send('wrong password')
                }
            } else {
                return res.status(400).send('something went wrong')
            }
        })

}

exports.signOut = (req, res) => {
    res.clearCookie('token')
    return res.status(200).send({ message: "signout successfully" })
}

exports.updateProfile = async (req, res) => {
    if (req.body.email) {
        User.findOneAndUpdate({ _id: req.user._id }, {
            $set: {
                "email": req.body.email
            }
        }, { new: true }).exec((error, user) => {
            if (error) {
                return res.status(400).send({ error })
            }
            if (user) {
                return res.status(201).send({ user: user })
            }
        })
    }


    if (req.body.contactNumber) {
        User.findOneAndUpdate({ _id: req.user._id }, {
            $set: {
                "contactNumber": req.body.contactNumber
            }
        }, { new: true }).exec((error, user) => {
            if (error) {
                return res.status(400).send({ error })
            }
            if (user) {
                return res.status(201).send({ user: user })
            }
        })
    }


    if (req.body.firstname) {
        const { firstname, lastname } = req.body;
        let gender;

        if (req.gender) {
            gender = req.gender
        } else { gender = "notSpecified" }

        User.findOneAndUpdate({ _id: req.user._id }, {
            $set: {
                "firstname": firstname,
                "lastname": lastname,
                "gender": gender
            }
        }, { new: true })
            .exec((error, user) => {
                if (error) {
                    return res.status(400).send({ error })
                }
                if (user) {
                    return res.status(201).send({ user: user })
                }
            })
    }

}


// exports.signUp=async(req,res)=>{

//     User.findOne({email:req.body.email})
//         .exec(async (err,isUser)=>{
//         if(isUser) return res.status(400).send("email already exists")
//         if(err){
//             return res.send(error)
//         }
//         const {firstname,
//             lastname,
//             username,
//             role,
//             contactNumber,
//             email,
//             password,
//             profilePicture}=req.body;

//         const hash_password=await bcrypt.hash(password,10)

//         let user=new User({
//             firstname,
//             lastname,
//             username,
//             role:'user',
//             contactNumber,
//             email,
//             hash_password,
//             profilePicture
//         })

//         //const newuser=await user.save();


//         user.save((err,data)=>{
//             if(err){
//                 return res.status(500).send(err)
//             }
//             if(data){
//                 console.log(data)
//                 return res.send(data)
//             }
//         })

//     })

// }

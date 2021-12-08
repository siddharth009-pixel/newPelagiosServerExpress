const User = require('../../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

exports.signUp = async (req, res) => {

    await User.findOne({ email: req.body.email })
        .exec(async (err, isUser) => {
            if (isUser) return res.status(400).send("email already exists")

            const { firstname,
                lastname,
                username,
                contactNumber,
                email,
                password,
                profilePicture } = req.body;

            const hash_password = await bcrypt.hash(password, 10)

            let user = new User({
                firstname,
                lastname,
                username,
                role: 'admin',
                contactNumber,
                email,
                hash_password,
                profilePicture
            })

            //const newuser=await user.save();


            user.save((err, data) => {
                if (err) {
                    return res.status(400).send({
                        message: err
                    })
                }
                if (data) {
                    console.log(data)
                    return res.send({ message: 'register successfully' })
                }
            })

        })

}


exports.signIn = async (req, res) => {
    User.findOne({ email: req.body.email })
        .exec(async (err, user) => {
            if (err) {
                return res.status(400).send(err)
            }
            if (!user) {
                return res.status(400).send({ error: 'email is not registered' })
            }
            if (user) {

                const passCheck = await user.authenticate(req.body.password)

                if (passCheck && user.role === 'admin') {
                    const token = jwt.sign({ _id: user._id, role: user.role }, process.env.SECRET_KEY, { expiresIn: '365d' })
                    res.cookie('token', token, { expiresIn: '365d' })
                    const {
                        firstname,
                        lastname,
                        email,
                        role,
                        fullName
                    } = user;
                    res.status(200).json({
                        token, user: {
                            firstname,
                            lastname,
                            email,
                            role,
                            fullName
                        }

                    })
                } else {
                    return res.status(400).send({ error: 'wrong password' })
                }
            } else {
                return res.status(400).send({ error: 'something went wrong' })
            }
        })

}

exports.signOut = (req, res) => {
    res.clearCookie('token')
    return res.status(200).send({ message: "signout successfully" })
}


const { body } = require('express-validator')
const Cart = require('../models/cart')


const runUpdate = (condition, updateData) => {
    return new Promise((resolve, reject) => {
        Cart.findOneAndUpdate(condition, updateData, { upsert: true })
            .then((result) => resolve(result))
            .catch((err) => reject(err))
    })
}


exports.addItemToCart = (req, res) => {
    console.log('add to cart item api');
    Cart.findOne({ user: req.user._id })
        .exec((err, cart) => {
            if (err) {
                console.log('err occured');
                return res.status(400).send({ error: err })
            }
            if (cart) {
                console.log('cart aviable')
                let promiseArray = []
                req.body.cartItems.forEach((cartItem) => {
                    const product = cartItem.product
                    const item = cart.cartItems.find(c => c.product == product)
                    let condition = {}
                    let update = {}
                    if (item) {
                        condition = { "user": req.user._id, "cartItems.product": product }
                        update = {
                            "$set": {
                                "cartItems.$": cartItem
                            }
                        }
                    } else {
                        condition = { "user": req.user._id }
                        update = {
                            "$push": {
                                "cartItems": cartItem
                            }
                        }
                    }

                    promiseArray.push(runUpdate(condition, update))

                })

                Promise.all(promiseArray)
                    .then((response) => {
                        return res.status(201).send({ response })
                    })
                    .catch((err) => {
                        return res.status(400).send({ error: 'sdfgh' })
                    })
            } else {
                console.log('cart not aviable')

                const cart = new Cart({
                    user: req.user._id,
                    cartItems: req.body.cartItems
                })
                cart.save((err, cart) => {
                    if (err) return res.status(400).send(err)
                    if (cart) return res.status(201).send(cart)
                })
            }

        })
}

exports.getCartItems = (req, res) => {
    console.log('sdfgh');
    Cart.findOne({ user: req.user._id })
        .populate({ path: 'cartItems.product', select: '_id name price productPictures' })
        .exec((error, cart) => {
            if (error) {
                return res.status(400).json({ error: error })
            }
            if (cart) {

                let cartItems = {};
                cart.cartItems.length > 0 && cart.cartItems.forEach((item, index) => {
                    cartItems[item.product._id.toString()] = {
                        _id: item.product._id.toString(),
                        name: item.product.name,
                        price: item.product.price,
                        img: item.product.productPictures[0].img,
                        qty: item.quantity
                    }
                })
                return res.status(200).json({ cartItems })
            }
            if(!cart){
                return res.status(200).send({})

            }
        })
}

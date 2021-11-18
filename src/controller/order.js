const Cart = require("../models/cart");
const Order = require("../models/order");


exports.addOrder = (req, res) => {
    console.log('hello 123');
    Cart.deleteOne({ user: req.user._id })
        .exec((err, cart) => {
            if (err) {
                return res.status(400).send({ error: err })
            }
            if (cart) {

                const orderStatus = [
                    {
                        type: 'ordered',
                        date: new Date(),
                        isCompleted: true
                    },
                    {
                        type: 'packed',
                        isCompleted: false
                    },
                    {
                        type: 'shipped',
                        isCompleted: false
                    },
                    {
                        type: 'delivered',
                        isCompleted: false
                    }
                ]
                const order = new Order({
                    ...req.body.payload, orderStatus, user: req.user._id
                })

                order.save((err, newOrder) => {
                    if (err) {
                        return res.status(400).send({ error: err })
                    }
                    if (newOrder) {
                        return res.status(201).send({ order: newOrder })
                    }
                })
            }


        })

}



exports.addInstantOrder = async (req, res) => {

}

exports.getOrders = async (req, res) => {
    Order.find({ user: req.user._id })
        .select('_id paymentStatus items')
        .populate({
            path: "items",
            populate: {
                path: 'productId',
                model: 'Product'
            }
        })
        .exec((error, orders) => {
            if (error) {
                return res.status(400).send({ error: error })
            }
            if (orders) {
                return res.status(200).send({ orders: orders })
            }
        })
}
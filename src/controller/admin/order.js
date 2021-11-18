const Order = require("../../models/order")

exports.updateOrder = async (req, res) => {
    Order.findOneAndUpdate({ _id: req.body.orderId, 'orderStatus.type': req.body.type }, {
        "$set": {
            "orderStatus.$": [
                {
                    type: req.body.type,
                    date: new Date(),
                    isCompleted: true
                }
            ]
        }
    },{new:true}).exec((err,order)=>{
        if(err){
            return res.status(400).send({error:err})
        }
        if(order){
            return res.status(201).send({order:order})
        }
    })
}

exports.getAllOrders=async(req,res)=>{
    const orders = await Order.find({}).exec()
    res.status(200).send({
        orders
    })
}
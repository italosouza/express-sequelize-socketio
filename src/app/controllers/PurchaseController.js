// const Ad = require('../models/Ad')
// const Purchase = require('../models/Purchase')

// const User = require('../models/User')
// const PurchaseMail = require('../jobs/PurchaseMail')
// const Queue = require('../services/Queue')

class PurchaseController {
  async store(req, res) {
    // const { ad, content } = req.body

    // const purchaseAd = await Ad.findById(ad).populate('author')
    // const user = await User.findById(req.userId)

    // const purchase = await Purchase.create({
    //   content,
    //   ad,
    //   user: user._id
    // })

    // Queue.create(PurchaseMail.key, {
    //   ad: purchaseAd,
    //   user,
    //   content
    // }).save()

    // return res.json(purchase)
    return res.send()
  }
}

module.exports = new PurchaseController()

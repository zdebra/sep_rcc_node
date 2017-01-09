const MongoClient = require('mongodb').MongoClient
const url = 'mongodb://localhost:27017/rcc'
const submitOne = require('../app/soap').submitChangeRequest



MongoClient.connect(url, function(err, db) {

    let ChangeRequest = db.collection('ChangeRequest')

    ChangeRequest.find({uploaded: false }).forEach((item) => {
        return submitOne(item.requestType, item.customerId, item.data)
            .then(() => {
                return ChangeRequest.updateOne({_id: item._id}, {$set: {uploaded: true}})
            })
            .then((resp) => {
                console.log(`Successfully submitted change request`, item, resp)
            })
            .catch((err) => {
                console.error(`Error: Change request wasn't submitted.`, err)
            })
    })


})




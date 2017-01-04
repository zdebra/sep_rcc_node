if(process.env.NODE_ENV === 'development') {
    require('dotenv').config();
}

const Bcrypt = require('bcrypt')
const MongoClient = require('mongodb').MongoClient

const insertUsers = async function insertUsers(db) {

    const hashedPass = await Bcrypt.hash('password', process.env.PASS_HASH)

    const collection = db.collection('user')

    return await collection.insertMany([
        {
            username: 'username',
            password: hashedPass
        },
        {
            username: 'admin',
            password: hashedPass
        }
    ])

}

// Use connect method to connect to the server
MongoClient.connect(process.env.MONGO_DB_URL, function(err, db) {
    console.log("Connected successfully to server");

    insertUsers(db)
        .then(resp=>{
            console.log("inserted",resp)
            db.close();
        })
        .catch((err)=>{
            console.error(err)
            db.close()
        })

});
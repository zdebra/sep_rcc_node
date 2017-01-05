if(process.env.NODE_ENV === 'development') {
    require('dotenv').config();
}

const Bcrypt = require('bcrypt')
const MongoClient = require('mongodb').MongoClient

const insertUsers = async function insertUsers(db) {

    const hashedPass = await Bcrypt.hash('passwordpassword', process.env.PASS_HASH)

    const collection = db.collection('user')

    return await collection.insertMany([
        {
            username: 'username',
            password: process.env.PASS_HASH
        },
        {
            username: 'admin',
            password: process.env.PASS_HASH
        }
    ])

}

const insertChangeRequests = async function insertChangeRequests(db) {

    const collection = db.collection('ChangeRequest')

    const items = [
        {
            actionType: 'delete',
            customerId: 2,
            authorId: 2,
            createdAt: new Date(),
        },
        {
            actionType: 'update',
            customerId: 1,
            authorId: 1,
            createdAt: new Date(),
            data: {
                createdAt: new Date(),
                firstName: "Franta",
                surname: "Vopršálek",
                address: [
                    {
                        streetName: "Africká",
                        streetNum: "160",
                        postalCode: "160 00",
                        cityPart: "Vokovice",
                        city: "Praha",
                        country: "CZ"
                    },
                    {
                        streetName: "Africká 2",
                        streetNum: "160",
                        postalCode: "160 00",
                        cityPart: "Vokovice",
                        city: "Praha",
                        country: "CZ"
                    },
                ],
                phoneNumber: [
                    {
                        type: "mobile",
                        number: "123456789",
                        cityCode: "12",
                        countryCode: "123"
                    },
                    {
                        type: "mobile",
                        number: "123456789",
                    }
                ],
                birthNumber: "123456788",
                countryOfOrigin: "CZ",
            },

        },
        {
            actionType: 'create',
            authorId: 1,
            createdAt: new Date(),
            data: {
                createdAt: new Date(),
                firstName: "Pepa",
                surname: "Suchac",
                address: [
                    {
                        streetName: "Africká",
                        streetNum: "160",
                        postalCode: "160 00",
                        cityPart: "Vokovice",
                        city: "Praha",
                        country: "CZ"
                    }
                ],
                phoneNumber: [
                    {
                        type: "mobile",
                        number: "13244214",
                        cityCode: "12",
                        countryCode: "123"
                    },
                    {
                        type: "mobile",
                        number: "123456789",
                    }
                ],
                birthNumber: "213213",
                countryOfOrigin: "US",
            },

        }
    ]

    return await collection.insertMany(items)

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
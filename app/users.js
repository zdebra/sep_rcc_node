module.exports = {

    get: async function getUser(db, username) {

        return await db.collection('user').findOne({username: username})

    }
}
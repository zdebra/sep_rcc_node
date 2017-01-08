module.exports = {

    get: async function getUser(db, username) {

        return await db.collection('user').findOne({username: username})

    },

    create: async function createChangeRequest(db, data) {

        data.uploaded = false
        let resp = await db.collection('ChangeRequest').insertOne(data)
        return resp
    }
}
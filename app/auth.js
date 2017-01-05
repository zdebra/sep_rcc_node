const Users = require('./users')

module.exports = function (server) {

    return async function validate (request, session, callback) {
        const db = request.server.plugins['hapi-mongodb'].db;

        const username = session.username

        let user = await Users.get(db,username)

        if (!user) {
            return callback(null, false)
        }

        server.log('info', 'user authenticated')
        callback(null, true, user)
    }

}
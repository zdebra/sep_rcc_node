const users = require('./users')

module.exports = function (server) {

    return function validate (request, session, callback) {

         const username = session.username;
         let user = users[username];

         if (!user) {
            return callback(null, false)
         }

        server.log('info', 'user authenticated')
        callback(null, true, user)
    }

}
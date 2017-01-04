const Boom = require('boom');
const Users = require('./users')
const Bcrypt = require('bcrypt')

module.exports = function (server) {

    server.route([
        {
            method: ['GET'],
            path: '/',
            config: {
                auth: {
                    mode: 'try',
                    strategy: 'session'
                },
                handler: function (request, reply) {

                    if(!request.auth.isAuthenticated) {
                        return reply.redirect('/login')
                    }

                    let session = request.auth.credentials

                    return reply.view('index', {username: session.username})

                }
            }
        },
        {
            method: ['POST', 'GET'],
            path: '/login',
            config: {
                auth: {
                    strategy: 'session',
                    mode: 'try',
                },
                handler: async function (request, reply) {

                    if(request.auth.isAuthenticated) {
                        return reply.view('index',request.auth.credentials)
                    }

                    if(request.method === 'get') {
                        return reply.view('login')
                    }

                    const username = request.payload.username;
                    let user = Users[username];

                    if (!user) {
                        return reply(Boom.notFound('No user registered with given credentials'))
                    }

                    const password = request.payload.password;

                    if(await Bcrypt.compare(password, user.password)) {
                        request.server.log('info', 'user authentication successful')
                        request.cookieAuth.set(user);
                        return reply.view('index', user)
                    } else {
                        return reply.view('login')
                    }
                }
            }
        },
        {
            method: 'GET',
            path: '/logout',
            config: {
                auth: 'session',
                handler: function (request, reply) {
                    request.cookieAuth.clear()
                    reply("You have been logged out.")
                }
            }
        }
    ])

}
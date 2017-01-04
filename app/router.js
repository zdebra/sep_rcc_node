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
                handler: function (request, reply) {

                    if(request.auth.isAuthenticated) {
                        return reply.view('index')
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

                    return Bcrypt.compare(password, user.password, function (err, isValid) {
                        if (isValid) {
                            request.server.log('info', 'user authentication successful')
                            request.cookieAuth.set(user);
                            return reply.view('index')
                        }

                        return reply.view('login')
                    })
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
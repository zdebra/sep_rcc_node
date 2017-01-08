const Boom = require('boom');
const Users = require('./users')
const Bcrypt = require('bcrypt')
const SoapService = require('./soap')
const submitChangeRequest = require('./changeRequest')

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

                    const db = request.server.plugins['hapi-mongodb'].db;

                    const username = request.payload.username;
                    let user = await Users.get(db,username)

                    if (!user) {
                        //return reply(Boom.notFound('No user registered with given credentials'))
                        return reply.view('login',{message: "Invalid credentials."})
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
        },
        {
            method: ['GET'],
            path: '/customers',
            config: {
                auth: {
                    mode: 'try',
                    strategy: 'session'
                },
                handler: async function(request, reply) {

                    if(!request.auth.isAuthenticated) {
                        return reply.redirect('/login')
                    }

                    let session = request.auth.credentials

                    let customers = await SoapService.listAllCustomers()

                    reply.view('customers', {customers: customers})

                }
            }
        },
        {
            method: ['GET', 'POST', 'PUT'],
            path: '/customer/{id}',
            config: {
                auth: {
                    mode: 'try',
                    strategy: 'session'
                },
                handler: async function(request, reply) {

                    if(!request.auth.isAuthenticated) {
                        return reply.redirect('/login')
                    }

                    let id = request.params.id
                    if(!id) {
                        return reply(Boom.create(400, 'Bad request', {timestamp: Date.now()}))
                    }

                    let session = request.auth.credentials

                    if(request.method === 'get') {

                        if(id === 'new') {
                            return reply.view('customer', {id: -1, status: 'active'})
                        }

                        let resp
                        try {
                            resp = await SoapService.customerDetail(id)
                        } catch (err) {
                            return reply(Boom.create(500, 'Main service is not responding', {timestamp: Date.now()}))
                        }

                        if(Array.isArray(resp.customer.firstName)) {
                            resp.customer.firstName = resp.customer.firstName.join(' ')
                        }

                        if(Array.isArray(resp.customer.surname)) {
                            resp.customer.surname = resp.customer.surname.join(' ')
                        }

                        if (!Array.isArray(resp.customer.address)) {
                            resp.customer.address = [resp.customer.address]
                        }

                        if (!Array.isArray(resp.customer.phoneNum)) {
                            resp.customer.phoneNum = [resp.customer.phoneNum]
                        }

                        return reply.view('customer', {customer: resp.customer, id: resp.id, status: resp.status})

                    }

                    let payload = request.payload

                    if(id === "new") {
                        payload.requestType = 'create'
                        payload.id = -1
                        let resp
                        try {
                            resp = await submitChangeRequest(request.server.plugins['hapi-mongodb'].db, payload)
                        } catch (err) {

                            return reply.view('customer', {customer: payload, id: payload.id, status: 'active', message: err.message})
                        }

                        return reply.view('index', {message: 'Change request has been successfully submitted.'})
                    }

                    if(payload.remove === "on") {

                        payload = {
                            requestType:'delete',
                            id: Number(id)
                        }

                        let resp
                        try {
                            resp = await submitChangeRequest(request.server.plugins['hapi-mongodb'].db, payload)
                        } catch (err) {

                            return reply.view('customer', {customer: payload, id: payload.id, status: 'active', message: err.message})
                        }

                        return reply.view('index', {message: 'Change request has been successfully submitted.'})

                    }


                    payload.requestType = 'update'
                    payload.id = Number(id)
                    let resp
                    try {
                        resp = await submitChangeRequest(request.server.plugins['hapi-mongodb'].db, payload)
                    } catch (err) {

                        return reply.view('customer', {customer: payload, id: payload.id, status: 'active', message: err.message})
                    }

                    return reply.view('index', {message: 'Change request has been successfully submitted.'})


                }
            }
        },

    ])

}
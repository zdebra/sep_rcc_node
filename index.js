'use strict';

const Hapi = require('hapi')
const Cookie = require('hapi-auth-cookie')
const Vision = require('vision')
const Handlebars = require('handlebars')


const server = new Hapi.Server()


async function setup() {

    try {

        server.connection({port: 8000})

        await server.register(Vision)

        server.views({
            engines: {
                html: Handlebars
            },
            path: __dirname + '/views',
            layout: true
        })

        server.route({
            method: 'GET',
            path: '/',
            handler: function (request, reply) {
                let data = {message: 'hello there', title: 'kocka'}
                reply.view('index', data)
            }
        })

        await server.start()

        console.log('Server running at:', server.info.uri)

    } catch (err) {
        console.log('Server not running:', err)
    }

}

setup()

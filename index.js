'use strict';

process.on('unhandledRejection', (err) =>{
    console.error(err)
})

if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const Hapi = require('hapi')
const CookieAuth = require('hapi-auth-cookie')
const Vision = require('vision')
const Handlebars = require('handlebars')
const Good = require('good')
const HapiMongoDb = require('hapi-mongodb')
const path = require('path')

const setupRoutes = require('./app/router')
const validateFunc = require('./app/auth')

const server = new Hapi.Server()


async function setup() {

    try {

        server.connection({
            port: process.env.PORT,
            host: process.env.HOST
        })

        await server.register([
            {
                register: Vision
            },
            {
                register:CookieAuth
            },
            {
                register: Good,
                options: {
                    ops: {
                        interval: 10000
                    },
                    reporters: {
                        console: [
                            {
                                module: 'good-squeeze',
                                name: 'Squeeze',
                                args: [ { log: '*', response: '*', request: '*' } ]
                            },
                            {
                                module: 'good-console'
                            },
                            'stdout'
                        ]
                    }
                }
            },
            {
                register: HapiMongoDb,
                options: {
                    url: process.env.MONGO_DB_URL,
                }
            }

        ])

        server.log('info', 'Plugins registered')

        server.views({
            engines: {
                html: Handlebars
            },
            path: path.join(__dirname, 'views'),
            layoutPath: path.join(__dirname, 'views', 'layout'),
            layout: 'default'
        })

        server.log('info', 'View configuration completed')

        server.auth.strategy('session', 'cookie', {
            password: process.env.PASS_HASH,
            isSecure: false,
            validateFunc: validateFunc(server)
        })

        server.log('info', 'Registered auth strategy: cookie auth')

        setupRoutes(server)
        server.log('info', 'Routes registered')

        await server.start()

        server.log('info', 'Server running at: ' + server.info.uri)

    } catch (err) {
        server.log('error', 'failed to start server')
        server.log('error', err)
        throw err
    }

}

setup()

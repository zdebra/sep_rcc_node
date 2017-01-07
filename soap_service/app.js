const soap = require('soap')
const http = require('http')

const myService = {
    MyService: {
        MyPort: {
            ReadAllCustomers: function(args, cb, headers, req) {
                console.log(args)
                return {
                    name: "youda"
                };
            },

            /*
            // This is how to define an asynchronous function.
            MyAsyncFunction: function(args, callback) {
                // do some work
                callback({
                    name: args.name
                });
            },

            // This is how to receive incoming headers
            HeadersAwareFunction: function(args, cb, headers) {
                return {
                    name: headers.Token
                };
            },

            // You can also inspect the original `req`
            reallyDetailedFunction: function(args, cb, headers, req) {
                console.log('SOAP `reallyDetailedFunction` request from ' + req.connection.remoteAddress);
                return {
                    name: headers.Token
                };
            }*/
        }
    }
};

const xml = require('fs').readFileSync('customerdatabase.wsdl', 'utf8')

//http server example
const server = http.createServer(function (request, response) {
    response.end("404: Not Found: " + request.url);
})

server.listen(8088);
const soapServer = soap.listen(server, '/wsdl', myService, xml)

soapServer.log = function (type, data) {
    console.log(type,data)
}
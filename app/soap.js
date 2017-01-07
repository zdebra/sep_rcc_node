const url = 'http://localhost:8088?wsdl'
const handsoap = require('handsoap')

const options = {
    namespaces: {
        'fel': 'http://www.cvut.cz/FEL/',
    }
}

module.exports = {
    listAllCustomers: async function() {

        let resp = await handsoap.request(url,'fel:ReadAllCustomers', 'http://www.cvut.cz/FEL/ReadAllCustomers', {}, options)
        if(resp.Envelope.Body.ReadAllCustomersResponse1 === undefined) {
            throw new Error("Invalid response")
        }

        if(resp.Envelope.Body.ReadAllCustomersResponse1.customer === undefined) {
            throw new Error("Invalid response")
        }

        return resp.Envelope.Body.ReadAllCustomersResponse1.customer

    },

    customerDetail: async function(id) {

        let resp = await handsoap.request(url,'fel:ReadCustomerDetails', 'http://www.cvut.cz/FEL/ReadCustomerDetails', {id: id}, options)

        return resp.Envelope.Body.ReadCustomerDetailsResponse1

    }
}
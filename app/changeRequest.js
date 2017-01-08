const _ = require('lodash')
const createChangeRequest = require('./users').create

function getName(name, label) {

    if (!_.isString(name)) {
        throw new Error(`${label} must be defined.`)
    }
    name = name.split(" ")
    if (name.length > 3 || name.length < 1) {
        throw new Error(`${label} must be from 1 to 3 words long.`)
    }

    return name
}

function getAddress(payload) {

    let createSingleAdr = (streetName, streetNumber, postalCode, cityPart, city, country) => {
        let address = {}
        if(streetName === "" && streetNumber === "" && postalCode === "" && cityPart === "" && city === "" && country === "") {
            return null
        }

        if(!_.isString(streetName)) {
            throw new Error("Invalid Street name.")
        }
        address.streetName = streetName

        if(!_.isString(streetNumber)) {
            throw new Error("Invalid Street number.")
        }
        address.streetNumber = streetNumber

        if(!_.isString(postalCode)) {
            throw new Error("Invalid Postal code.")
        }
        address.postalCode = postalCode

        if(_.isString(cityPart)) {
            address.cityPart = cityPart
        }

        if(!_.isString(city)) {
            throw new Error("Invalid City.")
        }
        address.city = city

        if(!_.isString(country)) {
            throw new Error("Invalid Country.")
        }
        address.country = country

        return address
    }

    let address = []
    let a1 = createSingleAdr(payload.streetName0, payload.streetNum0, payload.postalCode0, payload.cityPart0, payload.city0, payload.country0)
    let a2 = createSingleAdr(payload.streetName1, payload.streetNum1, payload.postalCode1, payload.cityPart1, payload.city1, payload.country1)
    let a3 = createSingleAdr(payload.streetName2, payload.streetNum2, payload.postalCode2, payload.cityPart2, payload.city2, payload.country2)

    if(a1 !== null) {
        address.push(a1)
    }

    if(a2 !== null) {
        address.push(a2)
    }

    if(a3 !== null) {
        address.push(a3)
    }

    if(address.length === 0) {
        throw new Error("At least one address must be given.")
    }

    return address
}

function getPhoneNum(payload) {

    let getSingleNum = (phoneNumberType, phoneNum, cityCode, countryCode) => {

        let singleNum = {}
        if(phoneNumberType === undefined
            && phoneNum === undefined
            && cityCode == undefined
            && countryCode == undefined) {
            return null
        }

        if(!_.isString(phoneNumberType)) {
            throw new Error("Invalid Phone number type.")
        }
        singleNum.phoneNumberType = phoneNumberType

        if(!_.isString(phoneNum)) {
            throw new Error("Invalid Phone number.")
        }
        singleNum.phoneNum = phoneNum

        if(_.isString(cityCode)) {
            singleNum.cityCode = cityCode
        }

        if(_.isString(countryCode)) {
            singleNum.countryCode = countryCode
        }

        return singleNum

    }

    let nums = []
    let n1 = getSingleNum(payload.phoneNumberType0, payload.phoneNum0, payload.cityCode0, payload.countrCode0)
    let n2 = getSingleNum(payload.phoneNumberType1, payload.phoneNum1, payload.cityCode1, payload.countrCode1)
    let n3 = getSingleNum(payload.phoneNumberType2, payload.phoneNum2, payload.cityCode2, payload.countrCode2)

    if(n1 != null) {
        nums.push(n1)
    }
    if(n2 != null) {
        nums.push(n2)
    }
    if(n3 != null) {
        nums.push(n3)
    }

    if(nums.length === 0) {
        throw new Error("At least one phone number must be given.")
    }

    return nums
}

function getBirthNumber(birthNumber) {
    if(!_.isString(birthNumber)) {
        throw new Error("Invalid birth number.")
    }
    return birthNumber
}

function getCountryOfOrigin(countryOfOrigin) {
    if(!_.isString(countryOfOrigin)) {
        throw new Error("Invalid Country of origin")
    }
    return countryOfOrigin
}

module.exports = async function submitChangeRequest(db, payload) {

    let cr
    switch (payload.requestType) {

        case 'create':
            payload.id = -1

        case 'update':
            if(!_.isNumber(payload.id)) {
                throw new Error("Invalid id.")
            }

            cr = {
                data: {
                    firstName: getName(payload.firstName, 'First name'),
                    surname: getName(payload.surname, 'Surname'),
                    address: getAddress(payload),
                    phoneNum: getPhoneNum(payload),
                    birthNumber: getBirthNumber(payload.birthNum),
                    countryOfOrigin: getCountryOfOrigin(payload.countryOfOrigin),
                },
                customerId: payload.id,
                requestType: payload.requestType
            }
            break

        case 'delete':

            if(!_.isNumber(payload.id)) {
                throw new Error("Invalid id.")
            }

            cr = {
                customerId: payload.id,
                requestType: payload.requestType
            }
            break

        default:
            throw new Error("Invalid request type.")
    }

    let resp = await createChangeRequest(db, cr)
    return resp


}
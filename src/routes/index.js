const express = require('express')
const route = express.Router()

const Controller = require('../controller/controller')


route.post('/add-contact',Controller.contact)
route.get('/getall', Controller.GetAllContact)


module.exports = route
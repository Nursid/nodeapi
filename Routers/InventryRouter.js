const { response } = require('express');

const router = require('express').Router()

const InventryController=require("../Controllers/InventryController")

router.get('/getall', InventryController.GetAllInventry);
router.get('/allot-item/getall',InventryController.GetAllAllotItems)
router.delete('/delete/:id',InventryController.DeleteItems)
router.post('/add',InventryController.AddInventory)
router.post('/update/:id',InventryController.UpdateItems)
router.post('/allot',InventryController.AllotedItems)



module.exports = router
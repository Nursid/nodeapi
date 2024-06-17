const router = require("express").Router();
const rolesController  = require('../../Controllers/RolesAndPermission/RolesAndPermissionController')


// set the Admin Roles
router.post("/add", rolesController.AddAdminRoles);
// get the roles 
router.get("/get/:role", rolesController.GetRoles);

// update the role field 
router.get("/update/:role/:field/:value", rolesController.UpdateRoles)






module.exports = router
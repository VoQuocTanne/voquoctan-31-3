var express = require('express');
var router = express.Router();
const roleSchema = require('../schemas/role');
let { check_authentication, check_authorization } = require("../utils/check_auth");
const constants = require('../utils/constants');

/* GET users listing. */
router.get('/', async function (req, res, next) {
  let roles = await roleSchema.find({});
  res.send({
    success: true,
    data: roles
  });
});

router.post('/', check_authentication, check_authorization(constants.ADMIN_PERMISSION), async function (req, res, next) {
  let body = req.body;
  let newRole = new roleSchema({
    name: body.name
  })
  await newRole.save();
  res.status(200).send({
    success: true,
    data: newRole
  });
});

// Add update and delete routes
router.put('/:id', check_authentication, check_authorization(constants.ADMIN_PERMISSION), async function (req, res, next) {
  try {
    let id = req.params.id;
    let role = await roleSchema.findById(id);
    if(role){
      let body = req.body;
      if(body.name){
        role.name = body.name;
      }
      await role.save()
      res.status(200).send({
        success:true,
        data:role
      });
    }else{
      res.status(404).send({
        success:false,
        message:"ID không tồn tại"
      });
    }
  } catch (error) {
    res.status(404).send({
      success:false,
      message:error.message
    });
  }
});

router.delete('/:id', check_authentication, check_authorization(constants.ADMIN_PERMISSION), async function (req, res, next) {
  try {
    let id = req.params.id;
    let role = await roleSchema.findById(id);
    if(role){
      await roleSchema.findByIdAndDelete(id);
      res.status(200).send({
        success:true,
        message: "Role deleted successfully"
      });
    }else{
      res.status(404).send({
        success:false,
        message:"ID không tồn tại"
      });
    }
  } catch (error) {
    res.status(404).send({
      success:false,
      message:error.message
    });
  }
});

module.exports = router;

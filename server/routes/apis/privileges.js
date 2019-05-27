const express = require('express');
const router = express.Router();
const passport = require("passport");

const ePrivilege = ['check'];
const mPrivilege = ['add', 'edit', 'delete', 'check'];

router.get('/',passport.authenticate("jwt", {session: false}), (req, res) => {
  const identity = req.query.identity;
  if (identity == 'manager') {
    return res.json({msg: '成功', data: mPrivilege})
  } else {
    return res.json({msg: '成功', data: ePrivilege})
  }
})

module.exports = router;


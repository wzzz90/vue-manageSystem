const express = require('express');
const router = express.Router();
const passport = require("passport");


const privilegeData = [{label: '资金流水', code: 'fundlist', subordinate: 'all'},{label: '添加', code: 'fundlist-add', subordinate: 'manager', parent: 'fundlist'},
                    {label: '编辑', code: 'fundlist-edit', subordinate: 'manager', parent: 'fundlist'},
                    {label: '删除', code: 'fundlist-delete', subordinate: 'manager', parent: 'fundlist'},
                    {label: '查看', code: 'fundlist-check', subordinate: 'all', parent: 'fundlist'}];

const ePrivilege = privilegeData.filter(item => item.subordinate === 'all').map(item => item.code);

router.get('/',passport.authenticate("jwt", {session: false}), (req, res) => {
    return res.json({msg: '成功', data: privilegeData,status: true})
})

router.get('/role',passport.authenticate("jwt", {session: false}), (req, res) => {
  const identity = req.query.identity;
  if (identity == 'manager') {
    return res.json({msg: '成功', data: privilegeData.map(item => item.code),status: true})
  } else {
    return res.json({msg: '成功', data: ePrivilege, status: true})
  }
  
})

module.exports = router;


const express = require('express');
const router = express.Router();
const passport = require("passport");

const Privilege = require("../../models/Privilege");


//获取全部人员权限
router.get('/',passport.authenticate("jwt", {session: false}), (req, res) => {
  Privilege.find()
    .then(privilegeData => res.json({msg: '成功', data: privilegeData,status: true}))
    .catch(err => res.json({msg: '查询成功', err: err, status: false}))
})


//根据角色获取权限
router.get('/role',passport.authenticate("jwt", {session: false}), (req, res) => {
  const identity = req.query.identity;
  Privilege.find()
    .then(privilegeData => {
      if (identity == 'manager') {
        return res.json({msg: '成功', data: privilegeData.map(item => item.code),status: true})
      } else {
        const ePrivilege = privilegeData.filter(item => item.subordinate === 'all').map(item => item.code);
        return res.json({msg: '成功', data: ePrivilege, status: true})
      }
    })
    .catch(err => res.json({msg: '查询成功', err: err, status: false}))
  
})


/* 添加权限 */
router.post('/add', passport.authenticate("jwt", {session: false}), (req, res) => {
  let privilegeParams = req.body;

  new Privilege(privilegeParams).save()
      .then(privilege => res.json({msg: '添加成功', status: true}))
      .catch(err => console.log(err))
})


/* 删除权限 */
router.delete('/delete/:id', passport.authenticate("jwt", {session: false}), (req, res) => {
  Privilege.findByIdAndRemove({_id: req.params.id})
  .then(privilege => {
    privilege.save().then(privilege => res.json({msg: '删除成功', status: true}))
  })
  .catch(err => res.json({msg: '删除失败', status: false, err: err}));
})

module.exports = router;


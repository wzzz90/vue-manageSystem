const express = require("express");
const router = express.Router();
const passport = require("passport");


const Profile = require("../../models/Profile");

/* $route GET /api/profiles/test
  @desc  返回请求的JSON数据
  @access public 
*/
router.get('/test', (req, res) => {
  res.json(`msg: Profile logined`)
})

/* $route POST /api/profiles/add
  @desc  添加信息
  @access private 
*/
router.post('/add', passport.authenticate("jwt", {session: false}), (req, res) => {
  const paramsArr = ['type','describe', 'income', 'expend', 'cash', 'remark'];
  let profileFields = {};
  paramsArr.forEach( item => {
    req.body[item] ? profileFields[item] = req.body[item] : '';
  })

  new Profile(profileFields).save()
      .then(profile => res.json(profile))
      .catch(err => console.log(err));

})

/* $route GET /api/profiles
  @desc  获取所有信息
  @access private 
*/
router.get('/', passport.authenticate("jwt", {session: false}), (req, res) => {
  Profile.find()
    .then(profiles => {
      if(!profiles) {
        return res.status(404).json('没有任何内容')
      }

      res.json(profiles)
    })
    .catch(err => console.log(err))
})

/* $route GET /api/profiles/:id
  @desc  获取单个信息
  @access private 
*/
router.get('/:id', passport.authenticate("jwt", {session: false}), (req, res) => {
  Profile.findById({_id: req.params.id})
    .then(profile => {
      if(!profile) {
        return res.status(404).json('没有任何内容')
      }

      res.json(profile)
    })
    .catch(err => console.log(err))
})


/* $route POST /api/profiles/:id
  @desc  编辑单个信息
  @access private 
*/
router.post('/edit/:id', passport.authenticate("jwt", {session: false}), (req, res) => {
  const paramsArr = ['type','describe', 'income', 'expend', 'cash', 'remark'];
  let profileFields = {};
  paramsArr.forEach( item => {
    req.body[item] ? profileFields[item] = req.body[item] : '';
  })


  Profile.findByIdAndUpdate({_id: req.params.id}, {$set: profileFields}, {new: true})
      .then(profile => res.json(profile))
      .catch(err => console.log(err));

})

/* $route DELETE /api/profiles/delete/:id
  @desc  删除单个信息
  @access private 
*/
router.delete('/delete/:id', passport.authenticate("jwt", {session: false}), (req, res) => {
  Profile.findByIdAndRemove({_id: req.params.id})
      .then(profile => {
        profile.save().then(profile => res.json(profile))
      })
      .catch(err => console.log(err));

})

module.exports = router;
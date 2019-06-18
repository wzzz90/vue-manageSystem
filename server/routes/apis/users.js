const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const gravatar = require("gravatar");
const User = require("../../models/Users.js");
const secretOrKey = require("../../config/key.js").secretKey;
const passport = require("passport");
/* $route GET /api/users/test
  @desc  返回请求的JSON数据
  @access public 
*/
router.get('/test', (req, res) => {
  res.json(`msg: logined`)
})

/* $route POST /api/users/register
  @desc  返回请求的JSON数据
  @access public 
*/
router.post('/register', (req, res) => {
  User.findOne({email: req.body.email})
  .then((user) => {
    if(user) {
      return res.status(400).json({msg: '邮箱已被注册', status: false})
    } else {
      var avatar = gravatar.url(req.body.email, {s: '200', r: 'pg', d: 'mm'});
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password,
        identity: req.body.identity
      })

      bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser.save()
                .then(user => res.json({msg: '注册成功', status: true, data: user}))
                .catch(err => res.json({msg: '注册失败', status: false, err: err}));
        });
      });
    }
  })
})

/* $route POST /api/users/login
  @desc  返回token jwt passport
  @access public 
*/
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  User.findOne({email})
  .then(user => {
    if(!user) {
      return res.status(404).json({msg: '用户尚未注册', status: false})
    }

    bcrypt.compare(password, user.password)
    .then((isMatch) => {
      if(isMatch) {
        const rule = { 
          name: user.name, 
          id: user.id,
          avatar: user.avatar,
          identity: user.identity,
          date: user.date
        }
        jwt.sign(rule, secretOrKey, { expiresIn: 7200 }, (err, token) => {
          if(err) throw err;
          return res.json({
            status: true,
            token: "Bearer " + token, 
            msg: '登录成功'
          })
        });
      } else {
        return res.status(400).json({msg: '用户名或密码错误', status:false})
      }
    });
  })
})

/* $route GET /api/users/current
  @desc  返回current user
  @access private 
*/
router.get('/current', passport.authenticate("jwt", {session: false}), (req, res) => {
  res.json({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    identity: req.user.identity,
  });
})


/* $route POST /api/users/edit
  @desc  返回msg
  @access private 
*/
router.post('/edit', (req, res) => {
  const _id = req.body.id
  
  delete req.body.id;
  const infoForm = req.body;
  
  User.findByIdAndUpdate({ _id },{$set: infoForm}, {new: true})
  .then(user => {
    const rule = { 
      name: req.body.name, 
      id: _id,
      avatar: req.body.avatar,
      identity: req.body.identity,
      date: req.body.date
    }
    jwt.sign(rule, secretOrKey, { expiresIn: 7200 }, (err, token) => {
      if(err) throw err;
      return res.json({
        status: true,
        token: "Bearer " + token, 
        msg: '编辑成功'
      })
    });
  })
  .catch(error => {
    res.json({
      status: false,
      id: _id,
      error: error,
      msg: '编辑失败'
    })
  })
})


module.exports = router;
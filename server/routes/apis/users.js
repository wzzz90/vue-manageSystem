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
      return res.status(400).json('邮箱已被注册')
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
                .then(user => res.json(user))
                .catch(err => console.log(err));
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
      return res.status(404).json( '用户不存在')
    }

    bcrypt.compare(password, user.password)
    .then((isMatch) => {
      if(isMatch) {
        const rule = { 
          name: user.name, 
          id: user.id,
          avatar: user.avatar,
          identity: user.identity,
        }
        jwt.sign(rule, secretOrKey, { expiresIn: 7200 }, (err, token) => {
          if(err) throw err;
          return res.json({
            success: true,
            token: "Bearer " + token, 
          })
        });
      } else {
        return res.status(400).json("密码错误")
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
    identity: req.user.identity
  });
})
module.exports = router;
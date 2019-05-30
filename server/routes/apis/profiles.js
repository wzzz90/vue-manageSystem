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

/* $route GET /api/profiles/statis
  @desc  获取统计信息
  @access public 
*/
router.get('/statis', (req, res) => {
  Profile.find()
    .then(profiles => {
      if(!profiles) {
        return res.status(404).json({status: false, msg: '没有数据'})
      }
      const year = req.query.year || 2019;
      const profileArr = [...profiles];
      let profileobj = {};
      for (let index = 1; index < 13; index++) {
        const obj = {
          income: 0,
          expend: 0,
          cash: 0
        }
        profileobj[index] = obj;
      }
      profileobj['total'] = {
        income: 0,
        expend: 0,
        cash: 0
      }

      profileArr.forEach(item => {
        if(year == new Date(item.date).getFullYear()) {
          const month = (new Date(item.date).getMonth() + 1);
          let monthObj = profileobj[month];
  
          monthObj.income += Number(item.income);
          monthObj.expend += Number(item.expend);
          monthObj.cash += Number(item.cash);

          profileobj['total'].income += Number(item.income);
          profileobj['total'].expend += Number(item.expend);
          profileobj['total'].cash += Number(item.cash);
        } else if(year == 'all') {
          profileobj['all'].income = Number(item.income);
          profileobj['all'].expend += Number(item.expend);
          profileobj['all'].cash += Number(item.cash);
        }
      })


      res.json({msg: '查询成功', data: profileobj, status: true})
    })
    .catch(err => {
      res.json({msg: '查询失败', status: false, err: err})
    })
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
      .then(profile => res.json({msg: '添加成功', status: true}))
      .catch(err => {
        res.json({msg: '添加失败', status: false, err: err})
      })

})

/* $route GET /api/profiles
  @desc  获取所有信息
  @access private 
*/
router.get('/', passport.authenticate("jwt", {session: false}), (req, res) => {
  Profile.find()
    .then(profiles => {
      if(!profiles) {
        return res.status(404).json({status: false, msg: '没有数据'})
      }

      res.json({msg: '查询成功', data: profiles, status: true})
    })
    .catch(err => {
      res.json({msg: '查询失败', status: false, err: err})
    })
})

/* $route GET /api/profiles/:id
  @desc  获取单个信息
  @access private 
*/
router.get('/:id', passport.authenticate("jwt", {session: false}), (req, res) => {
  Profile.findById({_id: req.params.id})
    .then(profile => {
      if(!profile) {
        return res.status(404).json({status: false, msg: '没有该条数据'})
      }

      res.json({msg: '查询成功', data: profile, status: true})
    })
    .catch(err => {
      res.json({msg: '查询失败', status: false, err: err})
    })
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
      .then(profile => res.json({msg: '编辑成功', status: true}))
      .catch(err => {
        res.json({msg: '编辑失败', status: false, err: err})
      });

})

/* $route DELETE /api/profiles/delete/:id
  @desc  删除单个信息
  @access private 
*/
router.delete('/delete/:id', passport.authenticate("jwt", {session: false}), (req, res) => {
  Profile.findByIdAndRemove({_id: req.params.id})
      .then(profile => {
        profile.save().then(profile => res.json({msg: '删除成功', status: true}))
      })
      .catch(err => res.json({msg: '删除失败', status: false, err: err}));

})



module.exports = router;
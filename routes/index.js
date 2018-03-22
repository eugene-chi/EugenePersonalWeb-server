let express = require('express');
let router = express.Router();

/* 设置主页 */
router.get('/', function (req, res) {
  res.render('index', {title: 'Express e'});
});

// 导入MySQL模块
let mysql = require('mysql');
let dbConfig = require('../server/db');
let personalInfoSQL = require('../server/personalInfoSql');
// 使用DBConfig.js的配置信息创建一个MySQL连接池
let pool = mysql.createPool(dbConfig.mysql);

// 响应一个JSON数据
let responseJSON = function (res, ret) {
  if (typeof ret === 'undefined') {
    res.json({
      msg: '操作失败'
    });
  } else {
    res.json(ret);
  }
};
// 查找个人信息
router.get('/personalInfo', function (req, res) {
  // 从连接池获取连接
  pool.getConnection(function (err, connection) {
    // 获取前台页面传过来的参数
    let param = req.query || req.params;
    // 设置参数
    let id = parseInt(param.id);
    // 设置查询语句
    let sqlText = personalInfoSQL.getPersonalInfoById + ';' + personalInfoSQL.getEducationalByPersonalInfoId + ';' + personalInfoSQL.getJobByPersonalInfoId;
    // 传入参数
    let sqlValue = [id, id, id];
    // 建立连接 查找
    connection.query(sqlText, sqlValue, function (err, result) {
      //结果拼接
      result = {
        'personalInfo': result[0][0],
        'educationalItem': result[1],
        'jobItem': result[2]
      };
      // 以json形式，把操作结果返回给前台页面
      responseJSON(res, result);
      // 释放连接
      connection.release();
    });
  });
});
// 修改个人信息
router.get('/updatePersonalInfo', function (req, res) {
  // 从连接池获取连接
  pool.getConnection(function (err, connection) {
    // 获取前台页面传过来的参数
    let param = req.query || req.params;

    // 设置参数
    let id = parseInt(param.id);
    // 设置查询语句
    let sqlText = personalInfoSQL.updatePersonalInfo+';'+personalInfoSQL.updateEducational;
    // 传入参数
    let sqlValue = [
      param.name, param.birthday, param.occupation, id,
      param.schoolName ,param.speciality ,param.schoolTime ,param.degree ,param.personalInfo_id,id,
    ];
    // 建立连接 查找
    connection.query(sqlText, sqlValue, function (err, result) {
      if (result) {
        result = {
          msg: '修改成功'
        };
      }
      // 以json形式，把操作结果返回给前台页面
      responseJSON(res, result);
      // 释放连接
      connection.release();
    });
  });
});



module.exports = router;
var express = require('express');
var jwt = require('jsonwebtoken');
var eschtml = require('htmlspecialchars');

var router = express.Router();
var con = require('../../config/database');

router.post('/', (req, res) => {
  let token = req.headers.authorization;
  try {
    var decoded = jwt.verify(token, 'ultrasecret');
  } catch (e) {
    res.end();
    return ;
  }
  var sql = `SELECT * FROM vues WHERE user_id = ?`;
  con.query(sql, [decoded.id], (err, result) => {
    res.json({success: result});
  });
});

module.exports = router;
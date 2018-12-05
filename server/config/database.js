var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root42"
  });

  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    con.query("CREATE DATABASE IF NOT EXISTS hypertube", (err) => { if (err) throw err;});
    con.query('USE `hypertube`', (err)=>  { if (err) throw err });
  
    var sql = "CREATE TABLE IF NOT EXISTS users (id INT PRIMARY KEY AUTO_INCREMENT, login VARCHAR(255), name VARCHAR(255), firstname VARCHAR(255), email VARCHAR(255), password VARCHAR(255), img VARCHAR(255))"
    con.query(sql, function (err, result) { if (err) throw err; console.log("Table users created"); });

  });
  
  module.exports = con;
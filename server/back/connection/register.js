var express = require('express');
var eschtml = require('htmlspecialchars');
var formidable = require('formidable');
var hash = require('password-hash');
var fs = require('fs');
var jwt = require('jsonwebtoken');

var router = express.Router();
var con = require('../../config/database');

router.post('/', (req, res) => {
    var form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
        if (fields.prenom && fields.nom && fields.email && fields.login && fields.password && fields.passwordConfirm) {
            var login = eschtml(fields.login);
            var name = eschtml(fields.nom);
            var firstname = eschtml(fields.prenom);
            var email = eschtml(fields.email);
            var password = eschtml(fields.password);
            var regUp = /[A-Z]+/;
            var regLow = /[a-z]+/;
            var regNumber = /[0-9]+/;
            var regMail = /^[a-z0-9._-]+@[a-z0-9._-]+\.[a-z]{2,6}$/;
            if (fields.password === fields.passwordConfirm) {
                if (password.search(regUp) !== -1 && password.search(regLow) !== -1 && password.search(regNumber) !== -1 && password.length > 5) {
                  if (files.photo && (files.photo.type === 'image/png' || files.photo.type === 'image/jpg' || files.photo.type === 'image/jpeg')) {
                     if (files.photo.size < (50 * 1024 * 1024)) {
                       if (email.search(regMail) !== -1) {
                                var sql = "SELECT email FROM users WHERE email = ?";
                                con.query(sql, [email], (err, result) => {
                                    if (result.length > 0)
                                        res.json({ error: "Désolé, cette adresse email est déja prise par un autre utilisateur" })
                                    else {
                                        var sql = "SELECT login FROM users WHERE login = ?";
                                        con.query(sql, [login], (err, result) => {
                                            if (result.length > 0)
                                                res.json({ error: "Nom d'utilisateur déja pris" })
                                            else {
                                                if (files.photo.type === 'image/png') {
                                                    var png = ".png";
                                                    var result1 = login + png;
                                                    var oldpath = files.photo.path;
                                                    var newpath = __dirname + '/../../public/img/' + result1;
                                                    fs.copyFile(oldpath, newpath, function (err) {
                                                        console.log("file moved (/server/register)");
                                                    });
                                                    var path =  'https://localhost:3001/img/' + result1;
                                                }
                                                else if (files.photo.type === 'image/jpg') {
                                                    var jpg = ".jpg";
                                                    var result1 = login + jpg;
                                                    var oldpath = files.photo.path;
                                                    var newpath = __dirname + '/../../public/img/' + result1;
                                                    fs.copyFile(oldpath, newpath, function (err) {
                                                        console.log("file moved (/server/register)");
                                                    });
                                                    var path =  'https://localhost:3001/img/' + result1;
                                                }
                                                else if (files.photo.type === 'image/jpeg') {
                                                    var jpg = ".jpeg";
                                                    var result1 = login + jpg;
                                                    var oldpath = files.photo.path;
                                                    var newpath = __dirname + '/../../public/img/' + result1;
                                                    fs.copyFile(oldpath, newpath, function (err) {
                                                        console.log("file moved (/server/register)");
                                                    });
                                                    var path =  'https://localhost:3001/img/' + result1;

                                                }
                                                con.query('INSERT INTO users SET login = ?, name = ?, firstname = ?, email = ?, password = ?, img = ?', [login, name, firstname, email, hash.generate(password), path]);
                                                con.query('SELECT ID FROM users WHERE email = ?', [email], (err, result) => {
                                                var ID = result[0].ID;
                                                console.log("ID est: " + ID);
                                                const token = jwt.sign({ id: ID }, 'ultrasecret');
                                                console.log(token);
                                                res.json({Success: "Merci pour votre inscription",
                                                        token});
                                                });
                                            }
                                        })
                                    }
                                })
                            }
                            else
                                res.json({ error: "Veuillez entrer une adresse mail valide" })
                        }
                        else
                            res.json({ error: "Le fichier uploader est trop gros, la taille maximale du fichier est de 5MB" })
                    }
                    else
                        res.json({ error: "Veuillez choisir un fichier jpg, jpeg ou png" })
                }
                else
                    res.json({ error: "Votre mot de passe doit contenir au moins une minuscule, une majuscule, un nombre, et contenir minimum 5 caractères" })
            }
            else
                res.json({ error: "Les mots de passes ne sont pas identiques" })
        }
        else
            res.json({ error: "Veuillez remplir les champs manquants" });
    });
})

module.exports = router
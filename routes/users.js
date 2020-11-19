const express = require('express')
const route = express.Router()
const passport = require('passport')
const bcrypt = require('bcryptjs')
const User = require('../models/user')
const { check, validationResult } = require('express-validator')

route.get('/register', (req, res) => {
    res.render('register', {
        title: 'Register'
    })
    
});

route.post('/register',[check('name', 'name must have a value.').notEmpty(), check('email', 'incorrect email format.').isEmail(), check('username', 'username must have a value.').notEmpty(), check('password', 'password must have a value.').notEmpty()], (req, res) => {
    var name = req.body.name
    var email = req.body.email
    var username = req.body.username
    var password = req.body.password
    //var password2 = req.body.password2

    const errors = validationResult(req)
   if(!errors.isEmpty()) {
       //  return res.status(422).jsonp(errors.array())
     const alert = errors.array()
     res.render('register', {
         alert: alert,
         title: 'Register'
     })
   } else {
       User.findOne({username: username}, (err, user) => {
           if(err) console.log(err)
           if(user) {
               req.flash('danger', 'username exist choose another')
               res.render('/users/register')
           } else {
               var user = new User({
                   name: name,
                   email: email,
                   username: username,
                   password: password,
                   admin: 1
               })
               bcrypt.genSalt(10, (err, salt) => {
                   bcrypt.hash(user.password, salt, (err, hash) => {
                       if(err) console.log(err)
                       user.password = hash

                       user.save((err) => {
                           if(err) console.log(err)

                           req.flash('success', 'successfully registered into the website')
                           res.redirect('/users/login')
                       })
                   })
               })
           }
       })
   }
});

route.get('/login', (req, res) => {
    if(res.locals.user) res.redirect('/')
    res.render('login', {
        title: 'Login'
    })
    
});

route.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true
    }) (req, res, next)
});

module.exports = route
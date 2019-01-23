const express    = require('express');
const passport   = require('passport');
const router     = express.Router();
const User       = require('../models/user')
const uploadCloud = require('../config/cloudinary')
const { ensureLoggedIn, ensureLoggedOut } = require('connect-ensure-login');

router.get('/login', ensureLoggedOut(), (req, res) => {
    res.render('authentication/login', { message: req.flash('error')});
});

router.post('/login', ensureLoggedOut(), passport.authenticate('local-login', {
  successRedirect : '/',
  failureRedirect : '/login',
  failureFlash : true
}));

router.get('/signup', ensureLoggedOut(), (req, res) => {
    res.render('authentication/signup', { message: req.flash('error')});
});

router.post('/signup', ensureLoggedOut(), passport.authenticate('local-signup', {
  successRedirect : '/',
  failureRedirect : '/signup',
  failureFlash : true
}));

router.get('/profile', ensureLoggedIn('/login'), (req, res) => {
    res.render('authentication/profile', {
        user : req.user
    });
});

router.post('/profile-upload', uploadCloud.single("photo"), ensureLoggedIn('/login'), (req,res)=>{
 const User = req.user
 User.updateOne({username: req.user.username},{photo: req.file.url})
 .then((user)=>{
    res.render('profile', {user});
  })
  .catch(err =>{
    console.log(err);
  });
});
  
router.get('/logout', ensureLoggedIn('/login'), (req, res) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;

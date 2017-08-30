var express = require('express');
var router = express.Router();
var passport = require('passport');
var db = require('../config/database.js');

/* GET home page. */
router.get('/', function(req, res){

  var post= null;
  if(req.user){
   post = db.getPosts(req.user.id,function(err,rows){
     console.log(rows);
      res.render('index', { user: req.user,posts:rows});
    });
 }
 else {
   res.render('index', { user: req.user,posts:null});
 }

});

//login API
router.get('/login', function(req, res){

  res.render('login', { user: req.user });
});

// GET /auth/facebook
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Facebook authentication will involve
//   redirecting the user to facebook.com.  After authorization, Facebook will
//   redirect the user back to this application at /auth/facebook/callback
router.get('/auth/facebook',
  passport.authenticate('facebook'),
  function(req, res){
    // The request will be redirected to Facebook for authentication, so this
    // function will not be called.
  });

// GET /auth/facebook/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
router.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

//logout API
router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}

//POST API to add a post
router.post('/api/addPost',function(req,res){
  var post = {};
  console.log(req.session);
  post.post_content = req.body.post_content;
  post.user_id = req.session.passport.user.id;
  db.dbInsertPost(post,function(){
    res.redirect('/');
  });
});

//GET API to delete a post
router.get('/api/deletePost/:postID',function(req,res){
  console.log(req.params.postID);
  db.deletePost(req.params.postID,function(){
    res.redirect('/');
  });
});


module.exports = router;

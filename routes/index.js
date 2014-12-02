var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

//GET/posts
router.get('/posts', function(req, res, next) {
  Post.find(function(err, posts){
    if(err){ return next(err); }
    res.json(posts);
  });
});
//create posts
router.post('/posts', function(req, res, next) {
  var post = new Post(req.body);
  post.save(function(err, post){
	if(err){ return next(err); }
	res.json(post);
  });
});
//preload
router.param('post',function(req,res,next,id){
	var query=Post.findBy(id);
	query.exec(function(err,post){
		if (err){ return next(err);}
		if (!post) {return next(new Error("can't find post"));}
		req.post=post;
		return next();
	});
});
router.get('/posts/:post', function(req,res){
	res.json(req.post);
});
//upvote post
router.put('/posts/:post/upvote', function(req,res,next){
	req.post.upvote(function(err,post){
		if (err) {return next(err);}
		res.json(post);
	});
});
//Create comment
router.post('/posts/:post/comments', function(req, res, next) {
  var comment = new Comment(req.body);
  comment.post = req.post;
  comment.save(function(err, comment){
    if(err){ return next(err); }
    req.post.comments.push(comment);
    req.post.save(function(err, post) {
      if(err){ return next(err);}
      res.json(comment);
    });
  });
});
router.put('/posts/:post/comments/upvote', function(req,res,next){
	req.post.comments.upvote(function(err,comment){
		if (err) {return next(err);}
		res.json(comment);
	});
});
router.param('comment',function(req,res,next,id){
	var query=post.comments.findBy(id);
	query.exec(function(err,comment){
		if (err){ return next(err);}
		if (!comment) {return next(new Error("can't find comment"));}
		req.post.comments=comment;
		return next();
	});
});
//populate post with comments
router.get('/posts/:post', function(req, res, next) {
  req.post.populate('comments', function(err, post) {
    res.json(post);
  });
});

module.exports = router;

var mongoose = require('mongoose');

var CommentSchema = new mongoose.Schema({
  body: String,
  user: String,
  upvotes: {type: Number, default: 0},
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' }
});

CommentSchema.methods.upvote = function(cb) {
	console.log("1.6");
  this.upvotes += 1;
  this.save(cb);
}

CommentSchema.methods.downvote = function(cb) {
	console.log("1.6");
  this.upvotes -= 1;
  this.save(cb);
}


mongoose.model('Comment', CommentSchema);
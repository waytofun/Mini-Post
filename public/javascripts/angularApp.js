'use strict';
angular.module('MiniPost', ['ui.router'])
.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: '/home.html',
      controller: 'MainCtrl',
      resolve: {
	  postPromise: ['posts', function(posts){
	    return posts.getAll();
	  }]
	}
    })
    .state('posts', {
	  url: '/posts/{id}',
	  templateUrl: '/posts.html',
	  controller: 'PostsCtrl',
	  resolve: {
	  post: ['$stateParams', 'posts', function($stateParams, posts) {
	    return posts.get($stateParams.id);
	  }]
	}
	});

  $urlRouterProvider.otherwise('home');
}])
.factory('posts', ['$http', function($http){
  var o = {
    posts: []
  };
  o.getAll = function() {
    return $http.get('/posts').success(function(data){
      angular.copy(data, o.posts);
    });
  };
  o.create = function(post) {
  	return $http.post('/posts', post).success(function(data){
   	 o.posts.push(data);
  	});
  };
  o.upvote = function(post) {
	return $http.put('/posts/' + post._id + '/upvote')
	  .success(function(data){
	    post.upvotes += 1;
	  });
  };
  o.downvote = function(post) {
	return $http.put('/posts/' + post._id + '/downvote')
	  .success(function(data){
	    post.upvotes -= 1;
	  });
  };
  o.get = function(id) {
	  return $http.get('/posts/' + id).then(function(res){
	    return res.data;
	  });
  };
  o.addComment = function(id, comment) {
	  return $http.post('/posts/' + id + '/comments', comment);
  };
  o.upvoteComment = function(post, comment) {

  	return $http.put('/posts/' + post._id + '/comments/'+ comment._id + '/upvote')
    .success(function(data){
      comment.upvotes += 1;
    });
  };
  o.downvoteComment = function(post, comment) {
  	return $http.put('/posts/' + post._id + '/comments/'+ comment._id + '/downvote')
    .success(function(data){
      comment.upvotes -= 1;
    });
  };
  return o;
}])
.controller('MainCtrl', [
'$scope',
'posts',
	function($scope, posts){
 	$scope.test = 'Hello world!';
	$scope.posts = posts.posts;

	$scope.addPost = function(){
	  if(!$scope.title || $scope.title === '' || !$scope.author || $scope.author ==='') { return; }
	  posts.create({
	    title: $scope.title,
	    author: $scope.author,
	  });
	  $scope.title = '';
	  $scope.author='';
	};
	$scope.reset = function(){
		$scope.title='';
		$scope.author='';
	}
	$scope.incrementUpvotes = function(post) {
	  posts.upvote(post);
	}
	$scope.decrementUpvotes = function(post) {
	  posts.downvote(post);
	}
}])
.controller('PostsCtrl', [
'$scope',
'posts',
'post',
function($scope, posts, post){
  $scope.post = post;
	$scope.addComment = function(){
	  if(!$scope.body || $scope.body === '' || !$scope.user || $scope.user === '') { return; }
	  posts.addComment(post._id, {
	    body: $scope.body,
	    user: $scope.user,
	  }).success(function(comment) {
	    $scope.post.comments.push(comment);
	  });
	  $scope.body = '';
	  $scope.user='';
	};
	$scope.reset= function(){
		$scope.body = '';
	  	$scope.user='';
	}
	$scope.incrementUpvotes = function(comment){
	  posts.upvoteComment(post, comment);
	};
	$scope.decrementUpvotes = function(comment){
	  posts.downvoteComment(post, comment);
	};
}]);
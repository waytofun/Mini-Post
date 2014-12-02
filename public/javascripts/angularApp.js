'use strict';
// Declare app level module which depends on views, and components
angular.module('myApp', ['ui.router'])
.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider,$urlRouterProvider){
	$stateProvider
		.state('home',{
		url:'/home',
		templateUrl:'/home.html',
		controller:'myCtrl',
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
.factory('posts',['$http',function($http){
	var p={
		posts:[]
	};
	p.getAll = function() {
		return $http.get('/posts').success(function(data){
			angular.copy(data, p.posts);
		});
	};
	p.create = function(post) {
		return $http.post('/posts', post).success(function(data){
		p.posts.push(data);
		});
	};
	p.upvote = function(post) {
	return $http.put('/posts/' + post._id + '/upvote')
	  .success(function(data){
	    post.upvotes += 1;
	  });
	};
	p.get = function(id) {
		return $http.get('/posts/' + id).then(function(res){
			return res.data;
		});
	};
	p.addComment = function(id, comment) {
		return $http.post('/posts/' + id + '/comments', comment);
	};
	return p;
}])
.controller('myCtrl',['$scope', 'posts',
function($scope,posts){
	$scope.test='Hello';
	$scope.posts=posts.posts;
	$scope.addPost=function(){
		if(!$scope.title || $scope.title===''){return;}
		posts.create({
			title:$scope.title,
			author:$scope.author,
		});
		$scope.title='';
		$scope.author='';
	};
	$scope.voteUp=function(post){
		posts.upvote(post);
	}
	$scope.voteDown=function(post){
		post.upvotes-=1;
	}
}])
.controller('PostsCtrl', [
'$scope',
'post',
'posts',
function($scope, posts,post){
	$scope.post = post;
	$scope.addComment = function(){
		if($scope.body === '' || $scope.user==='') { return; }
			posts.addComments(post._id,{
				body: $scope.body,
				user: $scope.user,
				upvotes: 0,
			}).success(function(comment) {
				$scope.post.comments.push(comment);
			});
		scope.body = '';
	};
	$scope.upVoteComment=function(comment){
		comment.upvotes+=1;
	}
	$scope.downVoteComment=function(comment){
		comment.upvotes-=1;
	}
}]);


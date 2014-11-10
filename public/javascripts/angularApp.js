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
		controller: 'PostsCtrl'
		});
	$urlRouterProvider.otherwise('home');
}])
.factory('posts',['$http',function($http){
	var p={
		posts:[]
		//{title:'Welcome!', author:'System', upvotes:100,comments: [
		//	{user: 'System', body: 'Welcome to mini-post!', upvotes:100},
		//]}
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
		//$scope.posts.push({
		//	title: $scope.title,
		//	author: $scope.author,
		//	upvotes: 0,
		//	comments: [
		//	{user: 'Joe', body: 'Cool post!', upvotes: 0},
		//	{user: 'Bob', body: 'Great idea but everything is wrong!', upvotes: 0}
		//	]
		//});
		$scope.title='';
		$scope.author='';
	};
	$scope.title="";
	$scope.voteUp=function(post){
		post.upvotes+=1;
	};
	$scope.voteDown=function(post){
		post.upvotes-=1;
	};
}])
.controller('PostsCtrl', [
'$scope',
'$stateParams',
'posts',
function($scope, $stateParams, posts){
	$scope.post = posts.posts[$stateParams.id];
	$scope.addComment = function(){
		if($scope.body === '' || $scope.user==='') { return; }
			$scope.post.comments.push({
				body: $scope.body,
				user: $scope.user,
				upvotes: 0
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


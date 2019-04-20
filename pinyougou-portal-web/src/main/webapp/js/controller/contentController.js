app.controller('contentController',function($scope,contentService){
	// 轮播的广告，做成集合
	$scope.contentList = [];
	$scope.findByCategoryId = function(categoryId){
		contentService.findByCategoryId(categoryId).success(
		    function(response){
		    	$scope.contentList[categoryId] = response;
		    }
		);
	}
});
app.controller('brandController', function($scope, $controller,brandService) {
	
		$controller('baseController',{$scope:$scope});//继承
		//查询品牌列表
		$scope.findAll = function() {
			brandService.findAll().success(function(response) {
				$scope.list = response;
			});
		}
		//分页 
		$scope.findPage = function(page, size) {
			brandService.findPage(page, size).success(function(response) {
				$scope.list = response.rows;//显示当前页数据 	
				$scope.paginationConf.totalItems = response.total;//更新总记录数 
			});
		}

		//新增
		$scope.save = function() {
			var obj = null;
			if ($scope.entity.id != null) {
				obj = brandService.update($scope.entity);
			} else {
				obj = brandService.add($scope.entity);
			}
			obj.success(function(response) {
				if (response.success) {
					$scope.reloadList();
					alert(response.message);
				} else {
					alert(response.message);
				}

			})

		}
		//根据id查单个数据
		$scope.findOne = function(id) {
			brandService.findOne(id).success(function(response) {
				$scope.entity = response;
			})
		}
		
		$scope.dele = function() {
			brandService.dele($scope.selectids).success(function(response) {
				if (response.success) {
					$scope.reloadList();
					$scope.selectids=[];
				}
			})
		}
		//根据查询条件查询
		$scope.searchEntity = {};
		$scope.search = function(page, size) {
			brandService.search(page, size, $scope.searchEntity).success(
					function(response) {
						$scope.list = response.rows;//显示当前页数据 	
						$scope.paginationConf.totalItems = response.total;//更新总记录数 
					});
		}
	});
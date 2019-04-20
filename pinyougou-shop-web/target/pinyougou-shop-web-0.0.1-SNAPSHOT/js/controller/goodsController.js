 //控制层 
app.controller('goodsController' ,function($scope,$controller,$location,goodsService,uploadService,itemCatService,typeTemplateService){	
	
	$controller('baseController',{$scope:$scope});//继承
	
    //读取列表数据绑定到表单中  
	$scope.findAll=function(){
		goodsService.findAll().success(
			function(response){
				$scope.list=response;
			}			
		);
	}    
	
	//分页
	$scope.findPage=function(page,rows){			
		goodsService.findPage(page,rows).success(
			function(response){
				$scope.list=response.rows;	
				$scope.paginationConf.totalItems=response.total;//更新总记录数
			}			
		);
	}
	
	//查询实体 
	$scope.findOne=function(){
		var id= $location.search()['id'];//获取参数值,通过location获取
		if(id == null){//判空
			return;
		}
		goodsService.findOne(id).success(
			function(response){
				$scope.entity= response;	
				//修改信息前的回显，这里使用页面修改，不弹出窗口
				//向编辑器中加入介绍===读取商品介绍
				editor.html($scope.entity.goodsDesc.introduction);
				/* 图片的json转换，如果dfs没有图片的话，那么将无法读取图片，所以测试数据需要插入图片
					json转换为objec对象
				*/
				$scope.entity.goodsDesc.itemImages = JSON.parse($scope.entity.goodsDesc.itemImages);
				//显示扩展属性
				$scope.entity.goodsDesc.customAttributeItems=  JSON.parse($scope.entity.goodsDesc.customAttributeItems);	
				//规格			
				$scope.entity.goodsDesc.specificationItems=JSON.parse($scope.entity.goodsDesc.specificationItems);				
				//SKU列表规格列转换	,循环拿到Goods里面的List的spec
				for( var i=0;i<$scope.entity.itemList.length;i++ ){
				    // 一样要转成对象，列表才能读取里面的key value
					$scope.entity.itemList[i].spec = JSON.parse( $scope.entity.itemList[i].spec);		
				}	

			}
		);				
	}
	
	//保存 
	$scope.save=function(){		
		$scope.entity.goodsDesc.introduction=editor.html();
		var serviceObject;//服务层对象  				
		if($scope.entity.goods.id!=null){//如果有ID
			serviceObject=goodsService.update( $scope.entity ); //修改  
		}else{
			serviceObject=goodsService.add( $scope.entity  );//增加 
		}				
		serviceObject.success(
			function(response){
				if(response.success){
					/*alert("保存成功");
					$scope.entity={};
					editor.html("");*/
					location.href="goods.html";//跳转到商品列表页
				}else{
					alert(response.message);
				}
			}		
		);
	}
	
	//增加商品 , 功能加到save里面了
	/*$scope.add=function(){			
		$scope.entity.goodsDesc.introduction=editor.html();
		alert(1);
		goodsService.add( $scope.entity ).success(
			function(response){
				if(response.success){
					alert("新增成功");
					$scope.entity={};
					editor.html("");//清空富文本编辑器
				}else{
					alert(response.message);
				}
			}		
		);				
	}*/
	
	 
	//批量删除 
	$scope.dele=function(){			
		//获取选中的复选框			
		goodsService.dele( $scope.selectIds ).success(
			function(response){
				if(response.success){
					$scope.reloadList();//刷新列表
					$scope.selectIds=[];
				}						
			}		
		);				
	}
	
	$scope.searchEntity={};//定义搜索对象 
	
	//搜索
	$scope.search=function(page,rows){			
		goodsService.search(page,rows,$scope.searchEntity).success(
			function(response){
				$scope.list=response.rows;	
				$scope.paginationConf.totalItems=response.total;//更新总记录数
			}			
		);
	}
	
	//上传图片
	$scope.uploadFile=function(){
		uploadService.uploadFile().success(
			function(response){
				if(response.success){
					//回显的路径
					$scope.image_entity.url= response.message;
				}else{
					alert(response.message);					
				}
			}		
		);
		
		
	}
	
	$scope.entity={ goodsDesc:{itemImages:[],specificationItems:[]}};
	
	//将当前上传的图片实体存入图片列表
	$scope.add_image_entity=function(){
		$scope.entity.goodsDesc.itemImages.push($scope.image_entity);			
	}
	
	//移除图片
	$scope.remove_image_entity=function(index){
		$scope.entity.goodsDesc.itemImages.splice(index,1);
	}
	//查询一级的商品分类
	$scope.selectItemCat1List = function(){
		itemCatService.findByParentId(0).success(
				function(response){
					$scope.itemCat1List = response;
				}
		);
	}
	//监控变量
	$scope.$watch("entity.goods.category1Id",function(newValue,oldValue){
//		alert(newValue);
		itemCatService.findByParentId(newValue).success(
				function(response){
					$scope.itemCat2List = response;
				}
		);
	});
	$scope.$watch("entity.goods.category2Id",function(newValue,oldValue){
//		alert(newValue);
		itemCatService.findByParentId(newValue).success(
				function(response){
					$scope.itemCat3List = response;
				}
		);
	});
	//读取模板ID
	$scope.$watch('entity.goods.category3Id',function(newValue,oldValue){
		
		itemCatService.findOne(newValue).success(
			function(response){
				//这个值赋值到前面的模板Id
				$scope.entity.goods.typeTemplateId=response.typeId;
			}
		);		
	});
	//模板id发生变化时，也就是最后三级菜单选中时
	$scope.$watch("entity.goods.typeTemplateId",function(newValue,oldValue){
		typeTemplateService.findOne(newValue).success(
				function(response){
					$scope.typeTemplate=response;// 模板对象 
					$scope.typeTemplate.brandIds= JSON.parse($scope.typeTemplate.brandIds);//品牌列表类型转换
					//扩展属性,要加上判断，如果没有id也就是增加商品，就要覆盖，不然影响后面的修改
					if($location.search()['id']==null){						
						$scope.entity.goodsDesc.customAttributeItems= JSON.parse($scope.typeTemplate.customAttributeItems);
					}
				});
		//读取规格
		typeTemplateService.findSpecList(newValue).success(
			function(response){
				$scope.specList=response;
			}
		);	
	});
	$scope.updateSpecAttribute=function($event,name,value){
		
		var object= $scope.searchObjectByKey($scope.entity.goodsDesc.specificationItems ,'attributeName', name);
		
		if(object!=null){	
			if($event.target.checked ){
				object.attributeValue.push(value);		
			}else{//取消勾选
				object.attributeValue.splice( object.attributeValue.indexOf(value ) ,1);//移除选项
				//如果选项都取消了，将此条记录移除
				if(object.attributeValue.length==0){
					$scope.entity.goodsDesc.specificationItems.splice(
							$scope.entity.goodsDesc.specificationItems.indexOf(object),1);
				}
				
			}
		}else{	
			$scope.entity.goodsDesc.specificationItems.push({"attributeName":name,"attributeValue":[value]});
		}
		
	}
	//创建SKU列表
	$scope.createItemList=function(){
		//根据tdItem创建
		$scope.entity.itemList=[{spec:{},price:0,num:99999,status:'0',isDefault:'0'} ];//列表初始化
		//用户选中的值
		var items= $scope.entity.goodsDesc.specificationItems;
		//([{"attributeName":"网络","attributeValue":["移动3G","移动4G","联通4G"]}])
		for(var i=0;i<items.length;i++){
			$scope.entity.itemList= addColumn( $scope.entity.itemList, items[i].attributeName,items[i].attributeValue );			
		}	
		
	}
	//克隆对象，用于createItemList遍历使用
	addColumn=function(list,columnName,columnValues){
		
		var newList=[];		
		for(var i=0;i< list.length;i++){
			//每一项规格,后面用于拿出网络制式
			var oldRow=  list[i];			
			for(var j=0;j<columnValues.length;j++){
				var newRow=  JSON.parse( JSON.stringify(oldRow));//深copy,先转字符串再转对象
				//对象赋值
				newRow.spec[columnName]=columnValues[j];
				newList.push(newRow);
			}			
		}		
		return newList;
	}
	/*这个数组用来表示审核，也就是数据库的0123，通过下标*/
	$scope.status = ['未审核','已审核','审核未通过','关闭'];
	//通过这个List，来创建key value格式的123级菜单。前端页面使用key拿出菜单的名字
	$scope.itemCatList = [];
	//查询商品分类列表
	$scope.findItemCatList = function(){
		itemCatService.findAll().success(
			function(response){
				for(var i=0;i<response.length;i++){
					$scope.itemCatList[response[i].id]=response[i].name;
				}
			}	
		);
	}
	// 判断规格是否勾中，返回的boolean类型供前台的ng-checked使用
	$scope.checkAttributeValue=function(specName,optionName){
		var items= $scope.entity.goodsDesc.specificationItems;
		var object =$scope.searchObjectByKey( items,'attributeName', specName);
		
		if(object!=null){
			if(object.attributeValue.indexOf(optionName)>=0){//如果能够查询到规格选项
				return true;
			}else{
				return false;
			}			
		}else{
			return false;
		}		
		// return true;//测试ng-checked指令
	}	
});	

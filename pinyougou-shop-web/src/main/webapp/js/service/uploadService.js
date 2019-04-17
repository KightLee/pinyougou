app.service('uploadService',function($http){
	
	//上传文件
	this.uploadFile=function(){
		/*H5新增的上传文件类*/
		var formdata=new FormData();
		formdata.append('file',file.files[0]);//file 文件上传框的name
		
		return $http({
			url:'../upload.do',		
			method:'post',
			data:formdata,
//			对表单进行二进制的序列化，让浏览器自己转换为multipart/form-data
			headers:{ 'Content-Type':undefined },
			transformRequest: angular.identity			
		});
		
	}
	
	
});
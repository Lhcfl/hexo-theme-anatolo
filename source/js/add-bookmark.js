function join_favorite(siteUrl, siteName){  
	//捕获加入收藏过程中的异常       
	try{       
		//判断浏览器是否支持document.all        
		if(document.all){                     
			window.external.addFavorite(siteUrl, siteName);                
		//如果支持则用external方式加入收藏夹              
		}else if(window.sidebar){                      
			window.sidebar.addPanel(siteName, siteUrl, '');         
		//如果支持window.sidebar，则用下列方式加入收藏夹  
		}else{
			alert("当前使用浏览器需要使用 Ctrl+D 快捷键添加书签！");  
		}					
	//处理异常       
	}catch(e){          
		alert("当前使用浏览器需要使用 Ctrl+D 快捷键添加书签！");   
	}
}

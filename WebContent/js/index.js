var Util = (function(){
	// 加perfix避免重名干扰
	var perfix = 'html5_reader_';
    var storageGetter = function(key){
    	return localStorage.getItem(perfix + key);
    }
    var storageSetter = function(key,val){
    	return localStorage.setItem(perfix+key, value);
    }
    return {
    	storageGetter: storageGetter,
    	storageSetter: storageSetter
    }
})();

function main(){
	// todo 整个项目的入口函数
}

function ReaderModel() {
	// todo 实现和阅读器相关的数据交互方法
}

function ReaderBaseFrame() {
	// todo 渲染基本的UI结构 
}

function EventHanlder() {
	// todo 交互事件绑定
}
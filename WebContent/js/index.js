$(function() {
	var Util = (function(){
		// 加perfix避免重名干扰
		var perfix = 'html5_reader_';
		var StorageGetter = function(key){
		    return localStorage.getItem(perfix + key);	
		}
		var StorageSetter = function(key,value){
		    return localStorage.setItem(perfix + key,value);	
		}
		// 获取并解密json数据(豆瓣数据为加密数据)
		// 通过url和duokan_fiction_chapter方法名获取到加密数据
		var getBSONP = function(url,callback){
			return $.jsonp({
				url: url,
				cache: true,
				callback: 'duokan_fiction_chapter',
				success: function(result){
					var data = $.base64.decode(result);
					var json = decodeURIComponent(escape(data));
					callback(json);
				}
			})
		};
		return {
			StorageGetter: StorageGetter,
			StorageSetter: StorageSetter,
			getBSONP: getBSONP,
		};
	})();

	var Dom = {
			top_nav: $('#top_nav'),
			bottom_nav: $('.bottom_nav'),
			font_button: $('#font_button'),
			font_container: $('.font_container'),
			fiction_container: $('#fiction_container')
	}

	var Win = $(window);
	var RootContainer = Dom.fiction_container;
	var iniFontSize = Util.StorageGetter('fontSize');
	if(!iniFontSize){
		iniFontSize = 14;
	}
	Dom.fiction_container.css('font-size',iniFontSize);

	function main(){
		// todo 整个项目的入口函数
		EventHanlder();
		var readerModle = ReaderModel();
		var readerUI = ReaderBaseFrame();
		readerModle.init(function(data){
			readerUI.parseChapterData(data);
		});
	}

	function ReaderModel() {
		// todo 实现和阅读器相关的数据交互方法
		var chapter_id;
		var init = function(UIcallback){
			getFictionInfo(function(){
				getCurChapterContent(chapter_id,function(data){
					UIcallback && UIcallback(data);
				});				
			})
		};
		var getFictionInfo = function(callback){
			$.get('data/chapter.json',function(data){
				chapter_id = data.chapters[0].chapter_id + 1;
				callback && callback(chapter_id);
			},'json')
		};
		var getCurChapterContent = function(chapter_id,callback){
			$.get('data/data'+chapter_id+'.json',function(data){
				if(data.result == 0){
					var url = data.jsonp;
					Util.getBSONP(url,function(dataJson){
						callback && callback(dataJson);
					})
				}else {
					console.log('请求状态错误');
				}
			},'json')
		};
		return {
			init: init,
		}
	}

	function ReaderBaseFrame() {
		// todo 渲染基本的UI结构 
		function parseChapterData(jsonData){
			var jsonObj = JSON.parse(jsonData);
			var html = "<h4>" +jsonObj.t+ "</h4>";
			for(var i = 0;i<jsonObj.p.length;i++){
				html += "<p>" +jsonObj.p[i]+ "</p>";
			}
			return html;
			
		}
		return function(container){
			container.html(html);
		};
	}

	function EventHanlder() {
		// todo 交互事件绑定
		$('#action_mid').click(function(){
			if(Dom.top_nav.css('display') == 'none'){
				Dom.top_nav.show();
				Dom.bottom_nav.show();
			} else {
				Dom.top_nav.hide();
				Dom.bottom_nav.hide();
				Dom.font_container.hide();
				Dom.font_button.removeClass('current');
			}
		})
		Dom.font_button.click(function(){
			if(Dom.font_container.css('display') == 'none'){
				Dom.font_container.show();
				Dom.font_button.addClass('current');
			} else{
				Dom.font_container.hide();
				Dom.font_button.removeClass('current');
			}
		})
		$('#large-font').click(function(){
			if(iniFontSize > 20){
				return;
			}
			iniFontSize += 1;
			Dom.fiction_container.css('font-size',iniFontSize);
		})
	    $('#small-font').click(function(){
	    	if(iniFontSize < 12){
				return;
			}
	    	iniFontSize -= 1;
	    	Dom.fiction_container.css('font-size',iniFontSize);
	    	Util.StorageSetter('fontSize',iniFontSize);
		})
		Win.scroll(function(){
			Dom.top_nav.hide();
			Dom.bottom_nav.hide();
			Dom.font_container.hide();
			Dom.font_button.removeClass('current');
			Util.StorageSetter('fontSize',iniFontSize);
		})
	}
	main();
});

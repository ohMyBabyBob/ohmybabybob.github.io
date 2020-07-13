// 搜索栏下拉菜单组件
$.fn.UIsearch=function(){
	var ui = $(this);
	$('.selected',ui).on('click',function(){
		$('.select-list').show();
		return false;//1.暴力阻止事件冒泡和默认事件;
					//2.event.stopPropagation()阻止冒泡但不阻止默认事件（标准的W3C 方式）
					//3.event.preventDefault()阻止默认事件但不阻止冒泡
					//4.ev.cancelBubble=true; 阻止冒泡但不阻止默认事件(非标准的IE方式) (这里的cancelBubble是 IE事件对象的属性)
					//取消函数冒泡方法封装
					//5.triggerHandler() 方法触发被选元素的指定事件类型。但不会执行浏览器默认动作，也不会产生事件冒泡。
					//
					// function stopBubble(e) {
					//    if ( e && e.stopPropagation )//如果提供了事件对象，则这是一个非IE浏览器
					//       e.stopPropagation();//因此它支持W3C的stopPropagation()方法
					//   else
					//   	window.event.cancelBubble = true;//否则，我们需要使用IE的方式来取消事件冒泡
					// }
		//事件冒泡：子事件的动作会向上传递给父亲直到window，如果祖上有元素绑定了事件就会被触发，那么body绑定的隐藏就会被触发。
	});
	$('.select-list a',ui).on('click',function(){
		$('.selected').text($(this).text());
		$('.select-list').hide();
		return false;
	});
	$('body').on('click',function(){
		$('.select-list').hide();
	});
};
// 选项卡组件

// ui定规
// @param {string} header Tab组件的选项卡的所有item
// @param {string} content Tab组件的内容区
// @param {string} focus_prefix 选项卡高亮样式，可选
$.fn.UItab=function(header,content,focusClass){
	var ui = $(this),
		focus=focusClass || '';
	$(header).on('click',function(){
		var index = $(this).index();
		$(header).removeClass(focus).eq(index).addClass(focus);
		$(content).eq(index).show().siblings().hide();
	});
};
//回到顶部组件
$.fn.UIbackTop = function(){
	var ui = $(this);
	var el = $('<a class="backTop"></a>');
	ui.append(el);
	var windowHight = $(window).height();
	$(window).on('scroll',function(){
		var top = $(window).scrollTop();
		if(top > windowHight*0.5){
			el.show();
			el.on('click',function(){
			$(window).scrollTop(0);
			});
		}else{
			el.hide();
		}
	});
};
// 幻灯片切换：滚动切换/无缝切换
// 1、向前向后切换按钮点击切换，且到尽头切回第一张
// 2、点击进度点，切换到对应图片
// 3、切换图片时，进度点联动
// 4、没有（按钮和进度点点击）的时候自动轮播
// 5、滚动过程中，屏蔽其他操作（自动滚动、左右翻页、进度点点击）
// 7、高级-无缝滚动：六张图跳跃
$.fn.UIslider = function(){
	// 参数定义
	var ui = $(this),
		view = $('.banner-view',ui),
		wrap = $('.img-wrap',ui),
		btn = $('.img-btn',ui),
		prev = $('.img-pre',ui),
		next = $('.img-next',ui),
		imgs = $('.img-wrap a',ui),
		dots = $('.dots > span',ui),
		viewWidth = view.width(),
		currentIndex = 0,
		enable = true;
	// 事件处理程序
	prev.on('move_prev',function(){
		if(currentIndex<1){
			currentIndex = 3;
		}
		currentIndex-=1;
		dots.triggerHandler('move_dots',currentIndex);
	})
	next.on('move_next',function(){
		currentIndex=(currentIndex+=1)%3;
		dots.triggerHandler('move_dots',currentIndex);
	})
	dots.on('move_dots',function(event,index){
		wrap.css('left',index*viewWidth*-1);
		dots.removeClass('focus').eq(index).addClass('focus');
	});
	// 事件定义执行
	prev.on('click',function(){
		prev.triggerHandler('move_prev');
	});
	next.on('click',function(){
		next.triggerHandler('move_next');
	});
	dots.on('click',function(){
		var index = $(this).index();
		dots.triggerHandler('move_dots',index);
	});
	// 自动轮播
	ui.on('mouseover',function(){
		enable = false;
	}).on('mouseout',function(){
		enable = true;
	}).on('move_auto',function(){
			setInterval(function(){
				enable&&next.triggerHandler('move_next')//短路
			}, 3000);
	}).triggerHandler('move_auto');//自执行
};

// 多级联动菜单组件
$.fn.UIcascading = function(){
	var ui = $(this),//.cascading
		selects = $('select',ui);
	selects
	// 联动监听
	.on('change',function(){
		var val = $(this).val();//0
		var area = $(this).attr('dataWhere');//0
		area = area?area.split(','):[];//空
		area.push(val);//当前datawhere值+当前选定值
		var index = selects.index(this);//0
		selects.eq(index+1).attr('dataWhere',area.join(',')).triggerHandler('reload');//字符串形式扔入1
	})
	// 事件处理程序
	.on('reload',function(){
		var methods = $(this).attr('dataSearch'),//1获取对象名
			where = $(this).attr('dataWhere').split(','),//获取组好的字符串转成数组
			data = AjaxRemoteGetData[methods].apply(this,where),//1间接调用
			select = $(this);//1
		select.find('option').remove();//清除多余
		$.each(data,function(i,item){//无计数循环遍历投放
			var el = ('<option value="'+item+'">'+item+'</option>');
			select.append(el);
		})
	});
	// 初始事件绑定
	selects.eq(0).triggerHandler('reload');
};

// 页面脚本逻辑
$(document).ready(function() {
	$('.search').UIsearch();
	$('.bottom').UItab('.bottomNav > a','.bottomContent','bottom-focus');
	$('.bottom').UItab('.selectNav > .city','.selectContent > .select','bottom-focus');
	$('.section').UItab('.topNav a','.sec');
	$('body').UIbackTop();
	$('.banner').UIslider();
	$('.cascading').UIcascading();
});

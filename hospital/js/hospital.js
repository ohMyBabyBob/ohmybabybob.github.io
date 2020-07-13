jQuery(document).ready(function($) {
	//0.筛选框预加载
	var type = AjaxRemoteGetData.getDistinctType().slice(1);//通过AjaxRemoteGetData对象的三个方法获取到初始选项数据
	var level = AjaxRemoteGetData.getDistinctLevel().slice(1);//并用slice方法截取数组第二个及以后数据（包括第二个
	var area = AjaxRemoteGetData.getDistinctArea().slice(1);
	var hospitalData = [],
		pageCount = 0,//页码个数
		currentPage = 0,//当前在第n页（0是第一页
		pageSize = 3;//每页大小

	$('.group > .condition').remove();//清除默认子选项
	$.each(type,function(i,item){//jQ的each方法循环遍历数组
		var item = $('<a href="#0" class="condition">'+item+'</a>');//创建子选项
		$('.group','.selectList').eq(0).append(item);//将创建的子选项投放到相应分类栏中
	});
	$.each(level,function(i,item){
		var item = $('<a href="#1" class="condition">'+item+'</a>');
		$('.group','.selectList').eq(1).append(item);
	});
	$.each(area,function(i,item){
		var item = $('<a href="#2" class="condition">'+item+'</a>');
		$('.group','.selectList').eq(2).append(item);
	});
//--------------------------------------------------------------------------------------
	//1.筛选条件框事件绑定&&刷新数据列表
	$('.selectList')
	.on('initEvent',function(){
		var selectList = $(this);
		$('.group',selectList).find('.condition').on('click',function(){//点击子选项时，子选项高亮，同组兄弟去掉高亮。然后重新加载数据。
			var condition = $(this);
			condition.parents('.group').eq(0).find('.condition').removeClass('focus');//此处为什么不使用children或sibilings？
			condition.addClass('focus');//因为全部选项在DOM结构中 不是condition直系兄弟，是被group底下的caption包裹的孙子。
			
			$(selectList).triggerHandler('reloadData');//每点一次就要刷新一次医院列表数据
			return false;//暴力阻止事件冒泡和默认事件
		});
		$(selectList).triggerHandler('reloadData');//即使不点，默认全部高亮，也要初始化刷新医院列表
	})
	.on('reloadData',function(){
		var selectList = $(this);
		var group = $('.group',selectList);
		var typeData = group.eq(0).find('.focus').text();
		var levelData = group.eq(1).find('.focus').text();
		var areaData = group.eq(2).find('.focus').text(); 
		hospitalData = AjaxRemoteGetData.getHospitalArrByFilter(typeData,levelData,areaData).slice(1);//从第二个数据开始截取，因为返回数据一是标题：医院列表
		
		$('.showList .pageList').triggerHandler('initPageNum');//刷新页码
	});
//--------------------------------------------------------------------------------------------
	//2.刷新渲染分页列表页码&&页码事件监听
	$('.showList .pageList')
	.on('initPageNum',function(){
		var pageList = $(this),
			pageNum = $('.pageNum',pageList);//每页大小
		pageCount = Math.ceil(hospitalData.length/pageSize);//js中的内置对象Math的ceil方法：向上取整，与floor相反
		pageNum.children().remove();//清除默认页码
		for (var i =0;i<pageCount;i++) {
			var page = $('<a href="#1" class="num">'+(i+1)+'</a>');//创建当前应有页码，并投入包裹元素
			pageNum.append(page);
		}

		$('.totalNum',pageList).empty().append(pageCount);//共计N页
		currentPage = 0;//默认显示第一页
		$('.showList .itemList').triggerHandler('render');//渲染页面
	})
	//pagination(分页页码)事件处理函数定义
	.on('initPageEvent',function(){
		var pageList = $(this);
		var pageNum = $('.pageNum',pageList);
		//首页、尾页
		$('.firstBtn',pageList).on('click',function(){
			currentPage = 0;
			$('.showList .itemList').triggerHandler('render');
			return false;
		});
		$('.lastBtn',pageList).on('click',function(){
			currentPage = pageCount-1;
			$('.showList .itemList').triggerHandler('render');
			return false;
		});
		//前进、后退
		$('.prevBtn',pageList).on('click',function(){
			if(currentPage!=0){
				currentPage -=1;
				$('.showList .itemList').triggerHandler('render');
				return false;
			}
		});
		$('.nextBtn',pageList).on('click',function(){
			if(currentPage!=pageCount-1){
				currentPage +=1;
				$('.showList .itemList').triggerHandler('render');
				return false;
			}
		});
		//页码
		pageNum.delegate('.num','click',function(){//给选中元素的多个子元素绑定一或多个事件并定义其事件处理函数(可向函数额外传参)
			currentPage = $(this).index();//为什么不用on方法绑定事件？因为delegate支持当前或未来(js动态生成的页码)的DOM元素。
			$('.showList .itemList').triggerHandler('render');
			return false;
		});
		//查找页(到第N页)
		$('.inputBtn',pageList).on('click',function(){
			var goPage = $('.inputText',pageList).val()-1;
			if(goPage>=0&&goPage<=pageCount-1){
				currentPage = goPage;
				$('.showList .itemList').triggerHandler('render');
				return false;
			}
		});

	})
	.triggerHandler('initPageEvent');//绑定事件
//------------------------------------------------------------------------------------------
	//渲染页面
	$('.showList .itemList')
	.on('render',function(){
		var itemList = $(this);
		itemList.empty();//清空列表
		var template = $('#template').html();//template:模板  html:返回匹配元素的innerHTML
		var currentData = hospitalData.slice(pageSize*currentPage,pageSize*(currentPage+1));//截取当前页面需要渲染的item数据.
		$('.showList .pageList .pageNum').children('.num').eq(currentPage).addClass('focus').siblings('.num').removeClass('focus');//渲染当前页码高亮
		for(j=0;j<currentData.length;j++){//for循环三个item，一个一个来，以下是每个选手要做的事
			var d = currentData[j];//得到当前选手数据
			var objectData = {//将数组数据的值们存放到对象并给他们对应属性命名，备用
				'area':d[0],'level':d[1],'type':d[2],
				'name':d[3],'address':d[4],'phone':d[5],
				'imgUrl':d[6],'time':d[7]
			};
			var html = template;//将事先得到的模板放入for循环里面的html备用，以免污染模板，造成重复渲染
			for(k in objectData){//k是对象属性名，objectData[k]是对应属性值
				html= html.replace('{'+k+'}',objectData[k]);//字符串替换方法，将模板相应数据替换
			}
			itemList.append(html);//按照模板做好的数据投放到包裹元素
		}
	});

	$('.selectList').triggerHandler('initEvent');
});
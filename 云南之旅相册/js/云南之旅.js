// $(document).ready(function(){
// 	// $("a").click(function(){
// 	// 	$("img").eq($(this).index()).css({"opacity":"1"}).siblings().css({"opacity":"0"});
// 	// });
// 	$('div').filter(function(index){
// console.log(index);
// 	});
// });
window.onload=function(){	//页面加载后再执行
var as=document.querySelectorAll("a"),
    imgs=document.querySelectorAll("img");
    // console.log(as);
for (var i = as.length - 1; i >= 0; i--) {
		// console.log(i);//i可用
		// console.log(this);//未绑定对象，this指向window
		// function f(){
		// 	return i;
		// }
		// as[i].index=i;
	(function(k) {
		as[k].onclick=function(index){
			console.log(index);
			for (var j = imgs.length - 1; j >= 0; j--) {
				imgs[j].style.opacity='0';
				// return;不能return，会影响停止后面的操作
				// console.log(this);this永远指向当前被绑定事件的对象
				// console.log(i);//i不可用，此时的i是外部for循环完成之后的最终结果-1
			}
			imgs[k].style.opacity='1';
			// imgs[[].indexOf.call(as,this)].style.opacity='1';
			//利用call方法借用数组的内置对象indexOf方法，将as替换原空数组，传入this查找并返回索引
	    }
	    })(i);
	}
};
// for (var i =5; i >= 0; i--) {
//   // console.log(i);//
//   // console.log(this);//window对象
//     for (var j =5; j >= 0; j--) {
//     console.log(this);//this永远指向当前被绑定事件的对象
//     // console.log(i);//i不可用，此时的i是外部for循环完成之后的最终结果-1
//    }   
// }

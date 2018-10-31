//// 开启进度条
//NProgress.start();
//
//setTimeout(function() {
//  // 关闭进度条
//  NProgress.done();
//}, 500)

$(function(){

  // 配置禁用小圆环
NProgress.configure({ showSpinner: false });


// ajaxStart 所有的 ajax 开始调用
$(document).ajaxStart(function(){
  NProgress.start();
});


// ajaxStop 所有的 ajax 结束调用
$(document).ajaxStop(function(){
 setTimeout(function(){
  NProgress.done();
 },5000);
});

});
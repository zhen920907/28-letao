/**
 * Created by Jepson on 2018/4/6.
 */
// 1.进度条的功能实现
$(function(){ 

  // 配置进度中的圆环效果
  NProgress.configure({
    showSpinner: false
  });

  // ajax发送之前调用进度条
  $(document).ajaxStart(function(){
   NProgress.start();
  });


   // ajax发送完成调用停止进度
   $(document).ajaxStop(function(){
     setTimeout(function(){
      NProgress.done();
     }, 800);
   }); 
});


 // 2.二级菜单的显示与隐藏功能
$(function(){ 
// 1.点击分类管理的a标签，让下面的child显示或者隐藏（切换显示或隐藏，有动画效果）
$('.child').prev().on('click',function(){
  $(this).next().stop().slideToggle();
});

// 2.点击右侧头部的菜单栏切换显示或隐藏功能
$('.icon_menu').on('click',function(){
  $('.lt_aside').toggleClass('now');
  $('.lt_main').toggleClass('now');
  $('.lt_main .lt_topbar').toggleClass('now');
});


 // 3. 退出功能的实现
  // 显示退出模态框
  // 点击退出按钮，模态框显示
  $('.lt_topbar .icon_logout').click(function(){
    $('#logoutModal').modal('show');
  });

  // 退出功能
  // 退出登陆的方式:
  // (1) 用户端(浏览器端), 用户自己清除浏览器缓存  (清空了 cookie),
  //     本质上将会话标识 sessionId 也清除了
  // (2) 前端通过发送ajax退出请求, 让后台销毁当前用户的登录状态
  // 点击模态框的确定按钮，退出登录
  $('#logout_Btn').click(function(){
    $.ajax({
      type: "get",
      url: "/employee/employeeLogout",
      // 如果后台在响应头中, 设置了 响应类型为 json 格式, 就可以省略 dataType
      data: "data",
      dataType: "json",
      success: function (info) {
        // console.log(info);
        if(info.success){
          // 跳转到登录页
          location.href = 'login.html';
        }
      }
    });
  });
});
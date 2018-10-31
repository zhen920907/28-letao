// 一进入页面, 判断当前用户是否是登陆的(发送请求询问后台), 如果是已登录才能继续访问

$(function(){
  $.ajax({
    type: "get",
    url: "/employee/checkRootLogin",
    dataType: "json",
    success: function (info) {
      // console.log(info);

    if(info.success){
      // console.log('当前用户已登录');
    };
    // 没有登录需要跳转到登录页
    if(info.error === 400){
        location.href = 'login.html';
    }
    }
  });

});

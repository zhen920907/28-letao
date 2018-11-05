$(function(){
   // 登录功能
  // (1) 点击登录按钮, 获取输入框的 用户名 和 密码
  // (2) 发送 ajax 登录 请求
  // (3) 处理响应
  $('#loginBtn').click(function(){
  //  获取到用户名和密码
  var username = $('#username').val().trim();
  var password = $('#password').val().trim();
  // 非空判断
  if(username == '') {
    // 提示请输入用户名
    mui.toast('请输入用户名') ;
    return;
  };
  if(password == '') {
    // 提示请输入密码
    mui.toast('请输入密码') ;
    return;
  }
  // 发送ajax登录请求
  $.ajax({
    type: "post",
    url: "/user/login",
    data: {
      username: username,
      password: password
    },
    dataType: "json",
    success: function (info) {
      console.log(info);
      if(info.error == 403){
        // 提示用户 用户名 或者 密码错误
        mui.toast('用户名 或者 密码错误') ;
        return;
      };

      if(info.success){
        // 登录成功
          // (1) 是从购物车等页面跳转过来的, 需要跳回去
          if(location.href.indexOf('retUrl') != -1){
            // 说明存在retUrl,需要跳回去
            var retUrl = location.search.replace('?retUrl=','');
           location.href = retUrl;

          }else{
            // (2) 如果直接访问 login.html, 跳转到个人中心
            location.href = 'user.html';
          }
          
      }
      
    }
  });

  });
})
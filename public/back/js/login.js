
// 防止全局变量污染, 等待dom渲染再执行
$(function() {
/*
   * 1. 进行表单校验配置
   *    校验要求:
   *        (1) 用户名不能为空, 长度为2-6位
   *        (2) 密码不能为空, 长度为6-12位
   * */


   //使用表单校验插件
$('#form').bootstrapValidator({  

  //1. 指定校验时的图标显示，默认是bootstrap风格
  feedbackIcons: {
    valid: 'glyphicon glyphicon-ok',  //校验成功的图标
    invalid: 'glyphicon glyphicon-remove',  //校验失败的图标
    validating: 'glyphicon glyphicon-refresh' //校验中的图标
  },

  //2. 指定校验字段,要先给input设置name属性
  fields: {
    //配置用户名校验，
    username: {
      // 配置校验规则
      validators: {
        //非空校验
        notEmpty: {
          // 非空提示
          message: '用户名不能为空'
        },

        //长度校验
        stringLength: {
          min: 2,
          max: 6,
          message: '用户名长度必须在2到6之间'
        },

         // 配置ajax回调的提示
         callback: {
          message: '用户名不能为空'
        }
        
      }
    },


     //配置密码校验，
     password: {
      //  配置校验规则
      validators: {
        //非空校验
        notEmpty: {
          // 非空提示
          message: '密码不能为空'
        },

        //长度校验
        stringLength: {
          min: 6,
          max: 12,
          message: '密码长度必须在6到12之间'
        },

        // 配置ajax回调的提示
        callback: {
          message: '密码错误'
        }
        
      }
    },
  }
});


// 2.登录成功的功能
// 当表单校验成功时，会触发success.form.bv事件，此时会提交表单，这时候，通常我们需要禁止表单的自动提交，使用ajax进行表单的提交。

$("#form").on('success.form.bv', function (e) {
  e.preventDefault();
  //使用ajax提交逻辑

  $.ajax({
    type: 'post',
    url: '/employee/employeeLogin',
    data: $('#form').serialize(),
    dataType: 'json',
    success: function(info){
          console.log(info);
          // 如果登录成功，跳转到首页
          if(info.success){
            location.href = 'index.html';
          }

          // 如果登录失败，错误是1000的话，就是校验用户名 校验失败的回调
          if(info.error === 1000) {
            // 提示用户名不存在
          // alert( info.message );
          // 调用插件实例方法, 更新校验状态成失败
          // updateStatus
          // 参数1: 校验字段
          // 参数2: 校验状态  NOT_VALIDATED未校验, VALIDATING校验中, INVALID校验失败 or VALID成功
          // 参数3: 配置校验规则, 用于配置提示信息

          $('#form').data('bootstrapValidator').updateStatus('username', 'INVALID', 'callback');
          }


          // 如果登录失败，错误是1001的话，就是验证密码校验失败的回调
          if(info.error === 1001) {
            $('#form').data('bootstrapValidator').updateStatus('password', 'INVALID', 'callback');
          }
    },    
  })
});


// 3.表单重置功能

// 点击重置按钮，然后重置表单
$(' [type="reset"]').on('click',function(){
  $('#form').data('bootstrapValidator').resetForm(true);

});
});
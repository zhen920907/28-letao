$(function(){
  
  var currentPage = 1;// 定义当前页
  var pageSize = 5;// 定义每页显示的信息条数
  // 1.页面一进来就需要渲染一次
  render();

  // 封装渲染方法
  function render(){
    $.ajax({
      type: "get",
      url: "/category/queryTopCategoryPaging",
      data: {
        page:currentPage,
        pageSize:pageSize
      },
      // dataType: "json",
      success: function (info) {
        // console.log(info);
        $('.lt_content tbody').html(template('tpl',info));

        // 分页效果
        $('.pagination').bootstrapPaginator({
          // 版本号
          bootstrapMajorVersion: 3,
          // 当前页
          currentPage: info.page,
          // 总页数
          totalPages: Math.ceil(info.total/info.size),
          // 给页码添加点击事件
          onPageClicked: function( a, b, c, page ){
            //选中的页码更新到当前页
            currentPage = page;
            //重新渲染
            render();
          }

        })
        
      }
    });
  }

  // 2.点击添加按钮，显示模态框
  $('#add_btn').click(function(){
      $('#addModal').modal('show');
  });

  // 3.表单验证功能，使用表单验证插件
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
      categoryName: {
        // 配置校验规则
        validators: {
          //非空校验
          notEmpty: {
            // 非空提示
            message: '请输入一级分类名称'
          },
        },
      },
    },
  });


  // 4. 注册表单校验成功事件, 阻止默认的提交, 通过 ajax 提交,如果表单校验成功，则关闭模态框，重新渲染第一页，重置模态框中的表单
  $("#form").on('success.form.bv', function (e) {
    e.preventDefault();
    //使用ajax提交逻辑  
    $.ajax({
      type: 'post',
      url: '/category/addTopCategory',
      data: $('#form').serialize(),
      dataType: 'json',
      success: function(info){
            console.log(info);
            // 隐藏模态框
            $('#addModal').modal('hide');
            // 重新渲染第一页，让添加的内容在第一页的最前面显示
            currentPage = 1;
            render();
            // 重置表单内容
            $('#form').data('bootstrapValidator').resetForm(true);           
          
      },    
    })
  });  

});
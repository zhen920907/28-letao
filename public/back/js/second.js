/**
 * Created by 54721 on 2018/11/1.
 */

 $(function(){
   var currentPage = 1; //定义当前页
   var pageSize = 5; //定义每页显示的条数

  //  1.页面一进来就要渲染一次
    render();
    // 封装渲染方法
    function render(){
    $.ajax({
      type: "get",
      url: "/category/querySecondCategoryPaging",
      data: {
        page:currentPage,
        pageSize:pageSize
      },
      dataType: "json",
      success: function (info) {
        // console.log(info);
        $('.lt_content tbody').html(template('tpl',info));

        // 初始分页插件，实现分页
        $('.pagination').bootstrapPaginator({
          bootstrapMajorVersion: 3,// 版本
          totalPages: Math.ceil(info.total/info.size), //总页数
          currentPage: info.page, //当前页
          // 给分页标签绑定点击事件
          onPageClicked: function(a,b,c,page){
            // 更新当前页
            currentPage = page;
            // 重新渲染页面
            render();
          }
        });
      }
    });
    }


  //2.点击添加按钮，让添加模态框显示
  $("#add_btn").click(function(){
  $('#addModal').modal('show');

  // // 请求模态框的下拉菜单数据, 进行渲染
    // /category/queryTopCategoryPaging
    // 提供的是分页接口, 我们可以通过 分页接口, 模拟获取全部一级分类的接口
    // 配置请求 第一页, 请求 100 条数据, 模拟接口

    $.ajax({
      type: "get",
      url: " /category/queryTopCategoryPaging",
      data: {
        page:1,
        pageSize:100
      },
      dataType: "json",
      success: function (info) {
        console.log(info);
        $('.dropdown-menu').html(template('dropdownTpl',info));
        
      }
    });

  });


  // 3.点击下拉列表中的某一个列表，让按钮中的文本与列表的文本一致
  // 注意 ，下拉列表是动态生成的，所以注册的事件是委托事件
  $('.dropdown-menu').on('click','a',function(){
    // 获取到列表中的文本
    var text = $(this).text();
    // 将获取的文本设置给按钮
    $('#dropdownText').text(text);

    // 获取选择的一级分类 id, 设置给隐藏域
    var id = $(this).data('id');
    $('[name="categoryId"]').val(id);

    // 让一级分类对应的隐藏域, 校验状态置成 校验成功
    // 参数1: 字段名称
    // 参数2: 校验状态
    // 参数3: 配置校验规则, 用来显示错误信息
    $('#form').data('bootstrapValidator').updateStatus('categoryId', 'VALID');
  });



  // 4. 配置文件上传插件
  $("#fileupload").fileupload({
    // 文件上传完成后，返回的数据类型
    dataType:"json",
    //e：事件对象
    // done: 文件上传完成后，返回的回调
    //data：图片上传后的对象，通过data.result.picAddr可以获取上传后的图片地址
    done:function (e, data) {
      console.log(data.result);
      // 获取到上传的文件的地址
      var picurl = data.result.picAddr;
      // 然后将获取到的url地址设置给img的src属性
      $('#img_box img').attr('src',picurl);
      // 将地址设置给隐藏域的value值
      $('[name="brandLogo"]').val(picurl);
      // 让图片上传对应的隐藏域, 校验状态置成 校验成功
      $('#form').data('bootstrapValidator').updateStatus('brandLogo', 'VALID');
    },

  });


  // 5.表单校验
  $('#form').bootstrapValidator({
    // 指定不校验的类型，默认为[':disabled', ':hidden', ':not(:visible)'],可以不设置
    // 对任意配置了的 input 都进行校验
    excluded: [],

    // 配置图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',   // 校验成功
      invalid: 'glyphicon glyphicon-remove',   // 校验失败
      validating: 'glyphicon glyphicon-refresh'  // 校验中
    },

    //2. 指定校验字段,要先给input设置name属性
    fields: {
    //配置一级分类校验，
    // 品牌名称
    brandName: {
      //校验规则
      validators: {
        notEmpty: {
          message: "请输入二级分类名称"
        }
      }
    },
    // 一级分类的id
    categoryId: {
      validators: {
        notEmpty: {
          message: "请选择一级分类"
        }
      }
    },


    //配置上传图片地址的隐藏域校验，
    brandLogo: {
      // 配置校验规则
      validators: {
        //非空校验
        notEmpty: {
          // 非空提示
          message: '请上传图片'
        },        
      }
    },     
    }, 

  });



  // 6. 注册表单校验成功事件, 阻止默认的表单提交, 通过 ajax 进行提交
    $('#form').on('success.form.bv', function( e ){

      // 阻止浏览器跳转
      e.preventDefault();
      $.ajax({
        type: "post",
        url: "/category/addSecondCategory",
        data: $('#form').serialize(),
        dataType: "json",
        success: function (info) {
          console.log(info);
          if(info.success){
            // 隐藏模态框
            $('#addModal').modal('hide');
            // 重新渲染第一页，
            currentPage = 1;
            render();

            //重置表单
            $('#form').data("bootstrapValidator").resetForm(true);

            // img图片和下拉菜单不是表单元素, 需要手动重置
            $('#img_box img').attr('src','images/none.png');
            $('#dropdownText').text('请选择一级分类');
          }
        }
      });
    })


 });
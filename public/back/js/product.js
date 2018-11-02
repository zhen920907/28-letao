

$(function(){
 var currentPage = 1; //当前页
 var pageSize = 2;   //每页多少条
 var picArr = [];   // 图片数组, 专门定义用于存储已上传的图片对象的(路径和名称)
  //  1.页面一进来就需要渲染一次
  render();
  // 封装渲染页面的方法
  function render(){
  $.ajax({
    type: "get",
    url: "/product/queryProductDetailList",
    data: {
      page:currentPage,
      pageSize: pageSize
    },
    dataType: "json",
    success: function (info) {
      // console.log(info);
      $('.lt_content tbody').html(template('tpl',info));

    //调用分页插件，实现分页功能
     $('.pagination').bootstrapPaginator({          
          bootstrapMajorVersion: 3,  // 指定版本          
          currentPage: info.page,  // 指定当前页页码
          totalPages: Math.ceil(info.total/info.size), //指定总条数
          // 给下面的页码添加点击事件
          onPageClicked: function( a, b, c, page ){
            // 当前页
            currentPage = page;
            render();
          }
     });
    


    }
  });
  };


  // 2.点击添加按钮，让模态框显示
  $('#add_btn').click(function(){
    $('#addModal').modal('show');

    // 发送 ajax 请求, 请求二级分类列表数据, 进行渲染下拉菜单
    $.ajax({
      type: "get",
      url: "/category/querySecondCategoryPaging",
      data: {
        page: 1,
        pageSize: 100
      },
      success: function (info) {
        // console.log(info);
        $('.dropdown-menu').html(template('dropdownTpl',info));
        
      }
    });
  });


  // 3.给下拉列表的a注册点击事件，事件委托
  $('.dropdown-menu').on('click','a',function(){
    // 获取当前a的文本，将获取到的文本设置给按钮
    var text = $(this).text();
    $('#dropdownText').text(text);

    // 获取到a的id,设置给隐藏域
    var id = $(this).data('id');
    $('[name="brandId"]').val(id);
    //选择二级分类的品牌名称，同步校验成功的状态
    $('#form').data('bootstrapValidator').updateStatus('brandId','VALID');
  });

  // 4.进行插件初始化
  $('#fileupload').fileupload({
    //返回的数据类型
    dataType: 'json',
    //返回的回调函数
    done: function(e,data){
      // console.log(data.result);

      //(1). 获取到上传图片的对象
      var picObj = data.result;

      //(2).获取上传的图片的地址
      var picUrl = picObj.picAddr;

      //(3). 将上传的图片的对象添加到上传图片数组的最前面
      picArr.unshift(picObj);

      //(4). 将获取到的图片地址设置给img的src属性，并且添加到img_box的子元素的最前面
      $('#img_box').prepend(' <img src="'+ picUrl + '" alt="">');

      // (5).当数组长度 > 3 时, 应该删掉最后一个
      // (1) 数组删掉最后一个上传图片的地址和名称
      // (2) 图片的地址去掉后,也需要删除掉最后一个图片，img标签
      if(picArr.length > 3){
        picArr.pop();
        $('#img_box img:last-of-type').remove(); //自杀
      };

      // (6). 如果图片上传满了 3 张, 应该让picStatus的校验状态, 置成校验成功
       if( picArr.length === 3){
        $('#form').data('bootstrapValidator').updateStatus('picStatus','VALID');
       } ;   
    }

  });


  // 5.表单校验
  $('#form').bootstrapValidator({
    // (1).让隐藏域也进行校验，默认对[':disabled', ':hidden', ':not(:visible)']这些属性的表单是不校验的，所以让所有input表单进行校验配置
    excluded: [],


    // (2).配置校验时候的状态图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',   // 校验成功
      invalid: 'glyphicon glyphicon-remove',   // 校验失败
      validating: 'glyphicon glyphicon-refresh'  // 校验中
    },

    // (3).配置校验字段
    fields: {
      // 1.二级分类的id校验
      brandId: {
        // 配置校验规则
        validators: {
          //非空校验
          notEmpty: {
            // 非空提示
            message: '请选择二级分类'
          },        
        }         
      },
  
  
      // 2.商品名称的校验
      proName: {
        // 配置校验规则
        validators: {
          //非空校验
          notEmpty: {
            // 非空提示
            message: '请输入商品名称'
          },        
        }         
      },

  

      // 3.商品描述校验
      proDesc: {
        // 配置校验规则
        validators: {
          //非空校验
          notEmpty: {
            // 非空提示
            message: '请输入商品描述'
          },        
        }         
      },

      // 4.商品库存校验
      num: {
        // 配置校验规则
        validators: {
          //非空校验
          notEmpty: {
            // 非空提示
            message: '请输入商品库存'
          },  
          
           // 要求库存必须是非零开头的数字
          // 正则校验  \d 表示数字 [0-9]
          // \d 出现 0次或多次
          // * 表示 0 次或多次
          // ? 表示 0 次或1次
          // + 表示 1 次或多次
          regexp: {
            regexp: /^[1-9]\d*$/,
            message: '库存必须是非零开头的数字'
          }

        }         
      },

      //5.商品尺码校验
      size: {
        // 配置校验规则
        validators: {
          //非空校验
          notEmpty: {
            // 非空提示
            message: '请输入商品尺码'
          },           
           // 要求尺码 必须是xx-xx 的格式,  xx 表示数字
          // 正则校验  \d 表示数字 [0-9]
          // \d 出现 0次或多次
          // * 表示 0 次或多次
          // ? 表示 0 次或1次
          // + 表示 1 次或多次
          regexp: {
            regexp: /^\d{2}-\d{2}$/,
            message: '尺码格式必须是xx-xx 的格式,例如32-40'
          },
        }         
      },

      // 6.商品原价校验
      oldPrice: {
        // 配置校验规则
        validators: {
          //非空校验
          notEmpty: {
            // 非空提示
            message: '请输入商品原价'
          },        
        }         
      },

      // 7.商品现价校验
      price: {
        // 配置校验规则
        validators: {
          //非空校验
          notEmpty: {
            // 非空提示
            message: '请输入商品价格'
          },        
        }         
      },

      //8.图片上传校验
      picStatus: {
        // 配置校验规则
        validators: {
          //非空校验
          notEmpty: {
            // 非空提示
            message: '请上传3张图片'
          },        
        }         
      },

    }[[]]
  }); 


  //6. 注册表单校验成功事件, 阻止默认的提交, 通过 ajax 提交
  $('#form').on('success.form.bv',function(e){
    // 阻止跳转
    e.preventDefault();

    // 拼接需要传给后台的参数
    var params = $('#form').serialize();
     console.log(params);
    // params += "&picName1="+ picArr[0].picName +"&picAddr1=" + picArr[0].picAddr;
    // params += "&picName2="+ picArr[1].picName +"&picAddr2=" + picArr[1].picAddr;
    // params += "&picName3="+ picArr[2].picName +"&picAddr3=" + picArr[2].picAddr;


    //表单添加提交
    $.ajax({
      type: "post",
      url: " /product/addProduct",
      data: params,
      dataType: "json",
      success: function (info) {
        console.log(info);
        if(info.success){
          // 关闭模态框
          $('#addModal').modal('hide');
          // 渲染第一页
          currentPage = 1;
          render();

          //重置表单内容和校验状态
          $('#form').data('bootstrapValidator').resetForm(true);

          // 手动重置二级分类选择和图片上传的内容
          $('#dropdownText').text('请选择二级分类');
          // 图片重置就是删除图片
          $('#img_box img').remove();
        }
        
      }
    });

  });


});
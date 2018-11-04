

$(function(){
  var currentPage = 1;
  var pageSize = 2;
  var picArr = []; //用于存储上传图片的地址和名称的
  // 1.页面一进来就需要渲染一次
  render();

  // 封装的渲染方法
  function render() {
    $.ajax({
      type: "get",
      url: "/product/queryProductDetailList",
      data: {
        page: currentPage,
        pageSize:pageSize
      },
      dataType: "json",      
      success: function (info) {
        // console.log(info);
        $('.lt_content tbody').html(template('tpl',info));

        // 分页插件初始化
        $('.pagination').bootstrapPaginator({
          bootstrapMajorVersion: 3,//版本号
          currentPage: info.page, //当前页
          totalPages: Math.ceil(info.total/info.size), //总页数

          // 给页码绑定点击事件
          onPageClicked: function(a,b,c,page){
            // 渲染当前页
            currentPage = page;
            render();

          }
        })
      }
    });
  };

// 2.点击添加分类按钮，模态框显示,然后发送ajax请求，渲染二级分类的列表
  $('#add_btn').click(function(){
    $('#addModal').modal('show');
    $.ajax({
      type: "get",
      url: "/category/querySecondCategoryPaging",
      data: {
        page: 1,
        pageSize: 100
      },
      dataType: "json",
      success: function (info) {
        // console.log(info);
        $('.dropdown-menu').html(template('dropdownTpl',info));
      }
    });
  });

  // 3.给a注册点击事件，注意是委托事件
  $('.dropdown-menu').on('click','a',function(){
    // 获取a的文本，设置给按钮
    var text = $(this).text();
    $('#dropdownText').text(text);

    // 获取a 的id，设置给隐藏域
    var id = $(this).data('id');
    $('[name="brandId"]').val(id);

    // 当选择某个分类时候，需要将校验状态改为成功的状态
    $('#form').data('bootstrapValidator').updateStatus('brandId','VALID');

  });

  // 4.上传文件（图片）插件初始化
  $('#fileupload').fileupload({
    //返回的数据类型
    dataType: 'json',
    // 返回的回调函数
    done: function(e,data){
      console.log(data.result);
      // 获取图片上传的对象
      var picObj = data.result;
      // 获取图片上传的地址
      var picUrl = picObj.picAddr;
      // 添加上传图片的对象到存储上传图片的数组中的最前面
      picArr.unshift(picObj);

      // 将获取的上传图片的地址 设置给img的地址并且添加到img_box的子元素的最前面
      $('#img_box').prepend ('<img src="'+ picUrl +'" alt="">');

      // 当数组长度大于3的时候，需要从数组最后面删除一个元素,然后让相对应的所有img中的最后一个img结构也删除
      if(picArr.length > 3){
        picArr.pop();
        $('#img_box img:nth-of-type').remove();
      };

       // 当数组长度等于3的时候，更新校验状态为成功
       if(picArr.length === 3){
        $('#form').data('bootstrapValidator').updateStatus('picStatus','VALID');
      };

    }
  });


  // 5.表单校验
  $('#form').bootstrapValidator({
    // (1)让所有input框都进行校验配置
    excluded: [],
    // (2)配置校验状态的图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',   // 校验成功
      invalid: 'glyphicon glyphicon-remove',   // 校验失败
      validating: 'glyphicon glyphicon-refresh'  // 校验中
    },

     // (3)配置字段校验
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

       // 2.商品名称校验
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
            message: '请选择商品库存'
          },        
            //正则校验，// \d 出现 0次或多次
          // * 表示 0 次或多次
          // ? 表示 0 次或1次
          // + 表示 1 次或多次
          regexp: {
            // 非空提示
            regexp: /^[1-9]\d*$/ ,
            message: '商品库存格式, 必须是非零开头的数字'
          },        
        }         
      },

      // 5.商品尺寸校验
      size: {
        // 配置校验规则
        validators: {
          //非空校验
          notEmpty: {
            // 非空提示
            message: '请输入商品尺码'
          },

          //正则进行校验 
          regexp: {
            // 非空提示
            regexp: /^\d{2}-\d{2}$/ ,
            message: '尺码格式必须是XX-XX的格式, 例如32-40'
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
            message: '请输入商品现价'
          },        
        }         
      },

      // 8.图片上传校验
      picStatus: {
        // 配置校验规则
        validators: {
          //非空校验
          notEmpty: {
            // 非空提示
            message: '请上传3张图片'
          },        
        }         
      }
    }
  });


  // 6.表单校验成功事件，阻止默认跳转，通过ajax提交渲染第一页面
  $('#form').on('success.form.bv',function(e){
    e.preventDefault();
    // 拼接需要传给后台的参数
    var params = $('#form').serialize();
    params += "&picName1="+ picArr[0].picName +"&picAddr1=" + picArr[0].picAddr;
    params += "&picName2="+ picArr[1].picName +"&picAddr2=" + picArr[1].picAddr;
    params += "&picName3="+ picArr[2].picName +"&picAddr3=" + picArr[2].picAddr;

    // 通过ajax提交渲染页面
    $.ajax({
      type: "post",
      url: " /product/addProduct",
      data: params,
      dataType: "json",
      success: function (info) {
        console.log(info);
        // 提交成功，关闭添加分类模态框
        if(info.success){
          $('#addModal').modal('hide');
          // 重新渲染第一页
          currentPage = 1;
          render();

          // 重置表单内容和表单校验状态
          $('#form').data('bootstrapValidator').resetForm(true);

          // 手动重置二级分类按钮内容和图片内容
          $('#dropdownText').text('请选择二级分类');
          $('#img_box img').remove();
        }        
      }
    });
  })


})
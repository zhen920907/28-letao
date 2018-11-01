
$(function(){
  var currentPage = 1;
  var pageSize = 5;
  //1. 页面一进来就需要渲染一次
  render();

  // 封装渲染页面的方法
  function render(){
    $.ajax({
      type: "get",
      url: "/user/queryUser",
      data: {
        page: currentPage,
        pageSize: pageSize,
      },
      dataType: "json",
      success: function (info) {
        // console.log(info);
         $('.table tbody').html(template('tpl',info));

        //分页实现
        $(".pagination").bootstrapPaginator({
          bootstrapMajorVersion:3, //默认是2，如果是bootstrap3版本，这个参数必填
          currentPage: info.page, //当前页
          totalPages: Math.ceil(info.total/info.size),//总页数

          // 当页面被点击时触发
          onPageClicked: function(a, b, c,page){
            //点击时候的页面为info中的page，然后需要重新渲染一下点击后的页面
            currentPage = page;
            render();
          }
        });
        
      }
    });
  };


  // 2.启用与禁用功能
  // 点击启用或者禁用按钮，模态框显示，点击模态框确定按钮，然后让当前启用或者禁用按钮所在的那一行禁用或者启用
  // 注意注册的是委托事件，因为tbody里面的内容都是动态生成的 
  $('.lt_content tbody').on('click','.btn',function(){
    // 模态框显示
    $('#userModal').modal('show');

    // 获取当前的按钮所在行的id，需要根据id进行判断启用或禁用的那一行
    var id = $(this).parent().data('id');
    // 需要将状态设置成禁用还是启用
    var isDelete = $(this).hasClass('.btn-success') ? 1 : 0 ;

    // 给模态框的确定按钮注册点击事件，
    // 注意在点击它的时候需先解绑一下他的click
    $('#userModal #okBtn').off('click').on('click',function(){
      $.ajax({
        type: "post",
        url: "/user/updateUser",
        data: {
          id: id,
          isDelete:isDelete,
        },
        dataType: "json",
        success: function (info) {
          console.log(info);
          if(info.success){
            // 关闭模态框，然后让页面重新渲染一下
            $('#userModal').modal('hide');
            render();
          }
        }
      });
    });   
  });
});
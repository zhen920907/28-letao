

$(function(){

  //1.页面一进来就要渲染左侧的一级分类导航
  $.ajax({
    type: "get",
    url: "/category/queryTopCategory",
    dataType: "json",
    success: function (info) {
      // console.log(info);
      $('.lt_category_left ul').html(template('left_tpl',info));
          // 还需要渲染第一个li的一级分类对应的二级分类
          renderById(info.rows[0].id);
    }
  });


  // 2.给一级分类中的a注册委托事件，发送ajax请求，渲染a对应的二级分类，让当前的一级分类的a添加now这个类，其他的a删掉now这个类
  $('.lt_category_left ul').on('click','a',function(){
    // 获取当前a的id
    var id = $(this).data('id');
    // 在这里需要根据id，发送ajax请求，渲染二级分类，直接调用方法即可
    renderById(id);
    // 需要将当前a添加now类，其他a删除now类
    $(this).addClass('now').parent().siblings().find('a').removeClass('now');
  });

  // 封装根据一级分类的id，渲染二级分类的方法
  function renderById(id){
    $.ajax({
      type: "get",
      url: "/category/querySecondCategory",
      data: {
        id: id,
      },
      dataType: "json",
      success: function (info) {
        console.log(info);
        $('.lt_category_right ul').html(template('right_tpl',info));        
      }
    });
  }




});
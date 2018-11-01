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
        console.log(info);
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

});



 });
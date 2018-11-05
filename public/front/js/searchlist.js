
$(function(){
  // 需求: 解析地址栏参数, 获取搜索关键字key,
  //       设置给 input框, 并且根据关键字发送请求, 进行渲染

  var key = getSearch("key"); //从地址栏获取关键字
  console.log(key);
  $('.lt_search .search').val(key); //将获取到的值赋值给input框
  render(); //1.渲染页面
  // 封装渲染方法，根据关键字发送ajax请求
  function render(){
    // 页面每次渲染都需要清空之前的内容，然后再渲染，这个是将之前的内容直接覆盖
    $('.lt_product').html(' <div class="loading"></div>' );
    // 3个必传的参数  
    var obj = {};//定义一个空对象用来传参数的
    obj.proName = $('.lt_search .search').val();
    obj.page = 1;
    obj.pageSize = 100;
   
    // 2个可选的参数 price  num 
    // (1) 根据有没有高亮的 a, 决定是否需要排序
      var $now = $('.lt_sort a.now'); //获取当前高亮的a
      if($now.length > 0){
        //表示有高亮的a，需要排序，获取到排序条件，（根据什么来排序：价格还是库存？）
        var sortName = $now.data('type'); //price或者是num
    // (2) 根据箭头的方向(类名), 决定降序还是升序,  2降序, 1升序 
    // 看高亮的a下的i是否有下箭头的类名，有的话是降序2，没有的话就是升序1；
        var sortValue = $now.find('i').hasClass('fa-angle-down') ? 2 : 1;
        // 然后就是将sortName添加到obj中，并赋值1或者2，看是升序还是降序，作为参数,
        obj[sortName] = sortValue;
      };

      setTimeout(function(){
        $.ajax({
          type: "get",
          url: "/product/queryProduct",
          data: obj,
          dataType: "json",
          success: function( info ) {
            console.log( info );
            $('.lt_product').html( template("tpl", info) );
          }
        });
      },800);
       
  };

  // 2.点击搜索按钮，进行搜索渲染页面
  $('.lt_search .search_btn').click(function(){
    render();
  });

  // 3.排序功能，
  // 1）给有data-type属性的a注册点击事件，
  // 2）判断a有没有now这个类，没有添加,并且排他，有需要切换方向，
  $('.lt_sort a[data-type]').click(function(){
    if($(this).hasClass('now')){
      // 表示有这个类
      $(this).find('i').toggleClass('fa-angle-down').toggleClass('fa-angle-up');

    }else{
      // 表示没有这个类
      $(this).addClass('now').siblings().removeClass('now');
    };
    // 根据 高亮的 a, 和箭头方向, 进行排序渲染
    render();

  });

});


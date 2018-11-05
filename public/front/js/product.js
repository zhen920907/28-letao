
$(function(){
  // 1.获取地址栏传过来的productId
  var productId = getSearch('productId');

  // 2.根据productId，渲染页面
  $.ajax({
    type: "get",
    url: "/product/queryProductDetail",
    data: {
      id:productId
    },
    dataType: "json",
    success: function (info) {
      console.log(info);
      $('.lt_main .mui-scroll').html(template('productTpl',info));

      // 手动在 轮播图 渲染完成后, 进行初始化
      //获得slider插件对象
      var gallery = mui('.mui-slider');
      gallery.slider({
        interval:5000//自动轮播周期，若为0则不自动播放，默认为0；
      });

      // 初始化：mui在mui.init()中会自动初始化基本控件,但是 动态添加的Numbox组件需要手动初始化
        mui('.mui-numbox').numbox();
    }
  });

  //3. 给尺码添加可选功能(通过事件委托注册),让点击的那个span添加current类
   $('.lt_main .mui-scroll').on('click','.lt_size span',function(){
     $(this).addClass('current').siblings().removeClass('current');
   });


  // 4. 加入购物车功能
   


})

$(function(){
// 分析：1.搜索历史记录渲染
//2.清空历史记录
//3.删除单个历史记录
//4.添加搜索历史记录

// 功能一:搜索历史记录渲染，页面一进来就要渲染一次
// 思路：1.先获取本地存储，获取的是json字符串格式
// 2.将字符串转换为数组，然后结合模板引擎进行渲染页面
render();

//封装获取本地存储的方法
function getHistory(){
  // 获取本地存储
  var jsonStr = localStorage.getItem('search_list') || '[]';
  // 转为数组
  var arr = JSON.parse(jsonStr);
  // 返回数组
  return arr;
};

// 封装渲染方法
function render(){
  // 获取arr，根据arr，结合模板引擎渲染
  var arr = getHistory();
  $('.lt_history').html(template('searchTpl',{list:arr}));
};


/*
  * 功能2: 清空历史记录
  * 思路:
  *   (1) 给 清空全部 添加点击事件 (事件委托注册)
  *   (2) 清除本地历史的记录 removeItem
  *   (3) 页面重新渲染
  * */
 $('.lt_history').on("click", ".btn_empty", function() {

  // 添加 mui 确认框
  // 参数1: message 提示信息
  // 参数2: title 提示标题
  // 参数3: btnArr 配置按钮显示的文本
  // 参数4: 关闭模态框, 触发的回调
  mui.confirm("你确定要清空历史记录嘛?", "温馨提示", ["取消", "确认"], function( e ) {
    // console.log( "关闭模态框时, 触发的回调函数" );
    // e.index 标记了用户点击的 按钮的下标
    if ( e.index === 1 ) {
      // 确认, 进行清空
      localStorage.removeItem( "search_list" );
      render();
    }

  })


});


// 功能三：删除单个历史记录
// 思路:
//   *   (1) 给删除按钮, 通过事件委托注册点击事件
//   *   (2) 存储下标, 点击的时候, 获取下标
//   *   (3) 根据下标, 删除数组的对应项
//   *   (4) 将数组存储到本地存储中
//   *   (5) 页面重新渲染
$('.lt_history').on('click','.btn_delete',function(){
  var index = $(this).data('index');
  var arr = getHistory();
  arr.splice(index,1);
  localStorage.setItem('search_list',JSON.stringify(arr));
   render();
});

// 功能四：添加搜索历史记录
// 点击搜索按钮,获取到input框中的文本，将文本存储到本地,在原有的数组基础上添加到数组最前面，然后渲染页面
// 1.点击搜索按钮，
// 2.获取搜索框的值，
// 3.如果搜索框没有内容，就给提示信息‘请输入搜索关键字’，然后返回；
// 4. 获取本地数组，
// 5.如果有重复的，删掉重复的那个;
// 6.如果长度超过10条，就从数组中删除最后一条记录
// 7.然后将将搜索框的值添加到数组最前面,然后转化为json字符串，存储到本地
// 8.然后重新渲染页面
// 9.清空输入框的内容
// 10.跳转到搜索列表页对应的商品信息展现出来

$('.search_btn').click(function(){
  // 获取搜索框的值，并且去掉两边的空格
  var key = $('.lt_search input').val().trim();
  if(key.length === 0){
    // mui 消息框
    mui.toast("请输入搜索关键字");
    return;
  };
  var arr = getHistory();
  var index = arr.indexOf(key);
  if(index != -1){
    arr.splice(index,1);
  };
  if(arr.length > 9){
    arr.pop();
  };
  arr.unshift(key)
  localStorage.setItem('search_list',JSON.stringify(arr));
  render();
  $('.lt_search input').val('');
  location.href = 'searchlist.html?key=' + key;
});



});
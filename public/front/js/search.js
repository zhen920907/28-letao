
$(function(){
// 分析：1.搜索历史记录渲染
//2.清空历史记录
//3.删除单个历史记录
//4.添加搜索历史记录

// 功能一:搜索历史记录渲染，页面一进来就要渲染一次
// 思路：1.先获取本地存储，获取的是json字符串格式
// 2.将字符串转换为数组，然后结合模板引擎进行渲染页面
   render();
// 封装获取本地的存储，获取的是转换为数组后的数据
function getHistory(){
  // 获取本地存储,如果获取的空内容null，就默认设置为‘[]’
  var jsonStr = localStorage.getItem('search_list') || '[]';
  // 将字符串转化为数组
  var arr = JSON.parse(jsonStr);
  // 将数组返回
  return arr;
};

// 封装渲染方法
function render(){
  //获取本地存储，转换为数组后的数据
  var arr = getHistory();
  // 结合模板引擎渲染
  $('.lt_history').html(template('history_tpl',{list:arr}));
};


//功能二： 清空历史记录
// 点击垃圾桶图标，弹出模态框，用mui插件实现，注意注册的是事件委托
$('.lt_history').on('click', '.btn_empty',function(){
  // 添加 mui 确认框
    // 参数1: message 提示信息
    // 参数2: title 提示标题
    // 参数3: btnArr 配置按钮显示的文本
    // 参数4: 关闭模态框, 触发的回调
    mui.confirm('你确定要清空历史记录吗？','温馨提示',['取消','确认'],function(e){
        // 如果e.index表示的是用户点击的那个按钮的下标
        if(e.index === 1){
      // 删除所有的历史记录,然后重新渲染页面
      localStorage.removeItem('search_list');
          render();
        };
    }) 

});

// 功能三：删除单个的历史记录
// 点击每条历史记录后的X,根据下标删除对应的数组，注意注册的是委托事件
// 1.点击的时候获取下标，根据获取的下标删除对应的数组，然后将数组存储到本地，最后在将页面渲染出来
$('.lt_history').on('click','.btn_delete',function(){
  // 获取下标,渲染模板中存了下标
  var index = $(this).data('index');
  // 获取历史记录中的数组
  var arr = getHistory();
  // 根据下标删除对应的数组，数组的splice方法,原数组改变，不会包括删除项
  // arr.splice(index,length) ,参数1：是从哪个下标开始删除，参数2：删除几个
  arr.splice(index,1);
  // 将数组转化为json字符串，并且存储到本地，然后重新渲染页面
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
  // 获取输入框中的关键字
  var key = $('input.search').val().trim();
  // 如果什么也没有输入
  if(key.length === 0){
    mui.toast('请输入搜索关键字');
    return;
  };

  // 获取数组
  var arr = getHistory();
  // 判断在追加最前面之前，看有没有重复项，有就从数组最后面删除掉
  // 获取key在数组中的下标
  var index = arr.indexOf(key);
  if(index != -1){
    // 说明有重复项,删除这一项
    arr.splice(index,1);
  };
  // 如果超过10条，就从后面删除一条，现在还没有追加，所以只要不超过10，就不用删除
  if(arr.length >9){
    arr.pop();
  };
  // 现在将获取的关键字添加到数组最前面
  arr.unshift(key);
  //将数组转化为字符串存储到本地
  localStorage.setItem('search_list',JSON.stringify(arr));
  // 重新渲染页面
  render();
  // 清空输入框的内容
  $('input.search').val('');
  // 需要跳转页面到搜索列表页面，并显示相对应的商品
  location.href = 'searchlist.html?key='+key;
});
});